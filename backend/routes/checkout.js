const pool = require("../db");

const TICKET_PRICES = {
  Adult: 29.99,
  Child: 19.99,
  Senior: 24.99
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

// insert product lines — stock trigger runs on each INSERT
async function insertProducts(connection, transactionId, productList) {
  for (const item of productList) {
    const productId = item.productId;
    const quantity = item.quantity;

    if (!productId || !quantity || quantity <= 0) {
      const err = new Error("Each product needs productId and quantity > 0");
      err.statusCode = 400;
      throw err;
    }

    const [productRows] = await connection.query(
      "SELECT Price, IsDeleted FROM product WHERE ProductID = ?",
      [productId]
    );

    if (productRows.length === 0 || productRows[0].IsDeleted === 1) {
      const err = new Error("Product not found");
      err.statusCode = 400;
      throw err;
    }

    await connection.query(
      `INSERT INTO transactionproduct (TransactionID, ProductID, Quantity, UnitPrice)
       VALUES (?, ?, ?, ?)`,
      [transactionId, productId, quantity, productRows[0].Price]
    );
  }
}

async function handleCheckout(req, res, pathname) {
  // POST /api/checkout — ticket required, products optional (one transaction)
  if (req.method === "POST" && pathname === "/api/checkout") {
    let connection;

    try {
      const body = await readBody(req);
      const { customerId, paymentType, ticketType } = body;
      const productList = Array.isArray(body.products) ? body.products : [];

      if (!customerId || !paymentType || !ticketType) {
        return sendJson(res, 400, { error: "Missing required fields" });
      }

      const ticketPrice = TICKET_PRICES[ticketType];
      if (ticketPrice == null) {
        return sendJson(res, 400, {
          error: "Ticket type must be Adult, Child, or Senior"
        });
      }

      connection = await pool.getConnection();
      await connection.beginTransaction();

      const [customerRows] = await connection.query(
        "SELECT CustomerID FROM customer WHERE CustomerID = ? AND IsDeleted = 0",
        [customerId]
      );
      if (customerRows.length === 0) {
        await connection.rollback();
        connection.release();
        return sendJson(res, 400, { error: "Customer not found" });
      }

      const [txResult] = await connection.query(
        `INSERT INTO \`transaction\` (CustomerID, \`Date\`, PaymentType)
         VALUES (?, NOW(), ?)`,
        [customerId, paymentType]
      );
      const transactionId = txResult.insertId;

      const [ticketResult] = await connection.query(
        `INSERT INTO ticket (TransactionID, Type, UnitPrice)
         VALUES (?, ?, ?)`,
        [transactionId, ticketType, ticketPrice]
      );

      // products are optional — empty list is fine (ticket-only sale)
      if (productList.length > 0) {
        await insertProducts(connection, transactionId, productList);
      }

      await connection.commit();
      connection.release();

      return sendJson(res, 201, {
        transactionId,
        ticketId: ticketResult.insertId,
        ticketType,
        ticketPrice,
        message: "Purchase complete"
      });
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
          connection.release();
        } catch (rollbackError) {
          console.error(rollbackError.message);
        }
      }
      console.error(error.message);
      return sendJson(res, error.statusCode || 400, { error: error.message });
    }
  }

  sendJson(res, 404, { error: "Route not found" });
}

module.exports = { handleCheckout };
