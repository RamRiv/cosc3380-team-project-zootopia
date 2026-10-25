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

async function handleCheckout(req, res, pathname) {
  // POST /api/checkout
  if (req.method === "POST" && pathname === "/api/checkout") {
    let connection;

    try {
      const body = await readBody(req);
      const { customerId, paymentType, ticketType, products } = body;

      if (!customerId || !paymentType || !ticketType) {
        return sendJson(res, 400, { error: "Missing required fields" });
      }

      const ticketPrice = TICKET_PRICES[ticketType];
      if (ticketPrice == null) {
        return sendJson(res, 400, {
          error: "Ticket type must be Adult, Child, or Senior"
        });
      }

      const productList = Array.isArray(products) ? products : [];

      connection = await pool.getConnection();
      await connection.beginTransaction();

      // customer must exist and not be soft-deleted
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
      const ticketId = ticketResult.insertId;

      for (const item of productList) {
        const productId = item.productId;
        const quantity = item.quantity;

        if (!productId || !quantity || quantity <= 0) {
          await connection.rollback();
          connection.release();
          return sendJson(res, 400, {
            error: "Each product needs productId and quantity > 0"
          });
        }

        // only sell products that are not soft-deleted
        const [productRows] = await connection.query(
          "SELECT Price FROM product WHERE ProductID = ? AND IsDeleted = 0",
          [productId]
        );

        if (productRows.length === 0) {
          await connection.rollback();
          connection.release();
          return sendJson(res, 400, { error: "Product not found" });
        }

        const unitPrice = productRows[0].Price;

        await connection.query(
          `INSERT INTO transactionproduct (TransactionID, ProductID, Quantity, UnitPrice)
           VALUES (?, ?, ?, ?)`,
          [transactionId, productId, quantity, unitPrice]
        );
      }

      await connection.commit();
      connection.release();

      return sendJson(res, 201, {
        transactionId,
        ticketId,
        ticketType,
        ticketPrice,
        message: "Checkout complete"
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
      return sendJson(res, 400, { error: error.message });
    }
  }

  sendJson(res, 404, { error: "Route not found" });
}

module.exports = { handleCheckout };