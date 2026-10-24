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

async function handleSpecies(req, res, pathname) {
  // /api/species or /api/species/1
  const parts = pathname.split("/").filter(Boolean);
  const id = parts[2];

  // GET /api/species
  if (req.method === "GET" && !id) {
    try {
      const [rows] = await pool.query("SELECT * FROM species");
      return sendJson(res, 200, rows);
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not get species" });
    }
  }

  // GET /api/species/:id
  if (req.method === "GET" && id) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM species WHERE SpeciesID = ?",
        [id]
      );

      if (rows.length === 0) {
        return sendJson(res, 404, { error: "Species not found" });
      }

      return sendJson(res, 200, rows[0]);
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not get species" });
    }
  }

  // POST /api/species
  if (req.method === "POST" && !id) {
    try {
      const body = await readBody(req);
      const { CommonName, ScientificName, Diet, ConservationStatus, AvgLifespan } = body;

      if (!CommonName || !ScientificName || !Diet || !ConservationStatus) {
        return sendJson(res, 400, { error: "Missing required fields" });
      }

      const [result] = await pool.query(
        `INSERT INTO species (CommonName, ScientificName, Diet, ConservationStatus, AvgLifespan)
         VALUES (?, ?, ?, ?, ?)`,
        [CommonName, ScientificName, Diet, ConservationStatus, AvgLifespan || null]
      );

      return sendJson(res, 201, { SpeciesID: result.insertId });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 400, { error: error.message });
    }
  }

  // PUT /api/species/:id
  if (req.method === "PUT" && id) {
    try {
      const body = await readBody(req);
      const { CommonName, ScientificName, Diet, ConservationStatus, AvgLifespan } = body;

      const [result] = await pool.query(
        `UPDATE species
         SET CommonName = ?, ScientificName = ?, Diet = ?,
             ConservationStatus = ?, AvgLifespan = ?
         WHERE SpeciesID = ?`,
        [CommonName, ScientificName, Diet, ConservationStatus, AvgLifespan || null, id]
      );

      if (result.affectedRows === 0) {
        return sendJson(res, 404, { error: "Species not found" });
      }

      return sendJson(res, 200, { message: "Species updated" });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 400, { error: error.message });
    }
  }

  // DELETE /api/species/:id
  if (req.method === "DELETE" && id) {
    try {
      const [result] = await pool.query(
        "DELETE FROM species WHERE SpeciesID = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return sendJson(res, 404, { error: "Species not found" });
      }

      return sendJson(res, 200, { message: "Species deleted" });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not delete species" });
    }
  }

  sendJson(res, 404, { error: "Route not found" });
}

module.exports = { handleSpecies };