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

async function handleShops(req, res, pathname) {
  // /api/shops or /api/shops/1
  const parts = pathname.split("/").filter(Boolean);
  const id = parts[2];

  // GET /api/shops
  if (req.method === "GET" && !id) {
    try {
      const [rows] = await pool.query("SELECT * FROM shop");
      return sendJson(res, 200, rows);
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not get shops" });
    }
  }

  // GET /api/shops/:id
  if (req.method === "GET" && id) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM shop WHERE ShopID = ?",
        [id]
      );

      if (rows.length === 0) {
        return sendJson(res, 404, { error: "Shop not found" });
      }

      return sendJson(res, 200, rows[0]);
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not get shop" });
    }
  }

  // POST /api/shops
  if (req.method === "POST" && !id) {
    try {
      const body = await readBody(req);
      const { Name, Location, ShopType } = body;

      if (!Name || !Location || !ShopType) {
        return sendJson(res, 400, { error: "Missing required fields" });
      }

      const [result] = await pool.query(
        "INSERT INTO shop (Name, Location, ShopType) VALUES (?, ?, ?)",
        [Name, Location, ShopType]
      );

      return sendJson(res, 201, { ShopID: result.insertId });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 400, { error: error.message });
    }
  }

  // PUT /api/shops/:id
  if (req.method === "PUT" && id) {
    try {
      const body = await readBody(req);
      const { Name, Location, ShopType } = body;

      const [result] = await pool.query(
        `UPDATE shop
         SET Name = ?, Location = ?, ShopType = ?
         WHERE ShopID = ?`,
        [Name, Location, ShopType, id]
      );

      if (result.affectedRows === 0) {
        return sendJson(res, 404, { error: "Shop not found" });
      }

      return sendJson(res, 200, { message: "Shop updated" });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 400, { error: error.message });
    }
  }

  // DELETE /api/shops/:id
  if (req.method === "DELETE" && id) {
    try {
      const [result] = await pool.query(
        "DELETE FROM shop WHERE ShopID = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return sendJson(res, 404, { error: "Shop not found" });
      }

      return sendJson(res, 200, { message: "Shop deleted" });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not delete shop" });
    }
  }

  sendJson(res, 404, { error: "Route not found" });
}

module.exports = { handleShops };