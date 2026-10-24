const pool = require("../db");

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

async function handleProducts(req, res, pathname) {
  // /api/products or /api/products/1
  const parts = pathname.split("/").filter(Boolean);
  const id = parts[2];

  // GET /api/products
  if (req.method === "GET" && !id) {
    try {
      const [rows] = await pool.query("SELECT * FROM product");
      return sendJson(res, 200, rows);
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not get products" });
    }
  }

  // GET /api/products/:id
  if (req.method === "GET" && id) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM product WHERE ProductID = ?",
        [id]
      );

      if (rows.length === 0) {
        return sendJson(res, 404, { error: "Product not found" });
      }

      return sendJson(res, 200, rows[0]);
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not get product" });
    }
  }

  // POST /api/products
  if (req.method === "POST" && !id) {
    try {
      const body = await readBody(req);
      const { Name, Price, Category, QuantityInStock, ShopID } = body;

      if (!Name || Price == null || !Category || QuantityInStock == null || !ShopID) {
        return sendJson(res, 400, { error: "Missing required fields" });
      }

      const [result] = await pool.query(
        `INSERT INTO product (Name, Price, Category, QuantityInStock, ShopID)
         VALUES (?, ?, ?, ?, ?)`,
        [Name, Price, Category, QuantityInStock, ShopID]
      );

      return sendJson(res, 201, { ProductID: result.insertId });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 400, { error: error.message });
    }
  }

  // PUT /api/products/:id
  if (req.method === "PUT" && id) {
    try {
      const body = await readBody(req);
      const { Name, Price, Category, QuantityInStock, ShopID } = body;

      const [result] = await pool.query(
        `UPDATE product
         SET Name = ?, Price = ?, Category = ?, QuantityInStock = ?, ShopID = ?
         WHERE ProductID = ?`,
        [Name, Price, Category, QuantityInStock, ShopID, id]
      );

      if (result.affectedRows === 0) {
        return sendJson(res, 404, { error: "Product not found" });
      }

      return sendJson(res, 200, { message: "Product updated" });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 400, { error: error.message });
    }
  }

  // DELETE /api/products/:id
  if (req.method === "DELETE" && id) {
    try {
      const [result] = await pool.query(
        "DELETE FROM product WHERE ProductID = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return sendJson(res, 404, { error: "Product not found" });
      }

      return sendJson(res, 200, { message: "Product deleted" });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not delete product" });
    }
  }

  sendJson(res, 404, { error: "Route not found" });
}

module.exports = { handleProducts };