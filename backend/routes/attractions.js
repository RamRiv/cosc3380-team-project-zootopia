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

async function handleAttractions(req, res, pathname) {
  // /api/attractions or /api/attractions/1
  const parts = pathname.split("/").filter(Boolean);
  const id = parts[2];

  // GET /api/attractions
  if (req.method === "GET" && !id) {
    try {
      const [rows] = await pool.query("SELECT * FROM attraction");
      return sendJson(res, 200, rows);
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not get attractions" });
    }
  }

  // GET /api/attractions/:id
  if (req.method === "GET" && id) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM attraction WHERE AttractionID = ?",
        [id]
      );

      if (rows.length === 0) {
        return sendJson(res, 404, { error: "Attraction not found" });
      }

      return sendJson(res, 200, rows[0]);
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not get attraction" });
    }
  }

  // POST /api/attractions
  if (req.method === "POST" && !id) {
    try {
      const body = await readBody(req);
      const { Name, Type, Schedule, EnclosureID } = body;

      if (!Name || !Type || !Schedule || !EnclosureID) {
        return sendJson(res, 400, { error: "Missing required fields" });
      }

      const [result] = await pool.query(
        `INSERT INTO attraction (Name, Type, Schedule, EnclosureID)
         VALUES (?, ?, ?, ?)`,
        [Name, Type, Schedule, EnclosureID]
      );

      return sendJson(res, 201, { AttractionID: result.insertId });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 400, { error: error.message });
    }
  }

  // PUT /api/attractions/:id
  if (req.method === "PUT" && id) {
    try {
      const body = await readBody(req);
      const { Name, Type, Schedule, EnclosureID } = body;

      const [result] = await pool.query(
        `UPDATE attraction
         SET Name = ?, Type = ?, Schedule = ?, EnclosureID = ?
         WHERE AttractionID = ?`,
        [Name, Type, Schedule, EnclosureID, id]
      );

      if (result.affectedRows === 0) {
        return sendJson(res, 404, { error: "Attraction not found" });
      }

      return sendJson(res, 200, { message: "Attraction updated" });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 400, { error: error.message });
    }
  }

  // DELETE /api/attractions/:id
  if (req.method === "DELETE" && id) {
    try {
      const [result] = await pool.query(
        "DELETE FROM attraction WHERE AttractionID = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return sendJson(res, 404, { error: "Attraction not found" });
      }

      return sendJson(res, 200, { message: "Attraction deleted" });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not delete attraction" });
    }
  }

  sendJson(res, 404, { error: "Route not found" });
}

module.exports = { handleAttractions };