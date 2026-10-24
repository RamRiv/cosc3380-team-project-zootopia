const pool = require("../db");

function sendJson(res,statusCode, data) {
  res.writeHead(statusCode, {"Content-Type": "application/json"});
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

async function handleAnimals(req, res, pathname) {
  // /api/animals or /api/animals/1
  const parts = pathname.split("/").filter(Boolean);
  const id = parts[2];



   // GET /api/animals
   if (req.method === "GET" && !id) {
    try {
      const [rows] = await pool.query("SELECT * FROM animal");
      return sendJson(res, 200, rows);
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not get animals" });
    }
  }


  // GET /api/animals/:id
  if (req.method === "GET" && id) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM animal WHERE AnimalID = ?",
        [id]
      );
      if (rows.length === 0) {
        return sendJson(res, 404, { error: "Animal not found" });
      }
      return sendJson(res, 200, rows[0]);
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not get animal" });
    }
  }


  // POST /api/animals
  if (req.method === "POST" && !id) {
    try {
      const body = await readBody(req);
      const { Name, SpeciesID, EnclosureID, Sex, DateOfBirth, AcquisitionDate } = body;
      if (!Name || !SpeciesID || !EnclosureID || !Sex || !AcquisitionDate) {
        return sendJson(res, 400, { error: "Missing required fields" });
      }
      const [result] = await pool.query(
        `INSERT INTO animal (Name, SpeciesID, EnclosureID, Sex, DateOfBirth, AcquisitionDate)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [Name, SpeciesID, EnclosureID, Sex, DateOfBirth || null, AcquisitionDate]
      );
      return sendJson(res, 201, { AnimalID: result.insertId });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 400, { error: error.message });
    }
  }

  // PUT /api/animals/:id
  if (req.method === "PUT" && id) {
    try {
      const body = await readBody(req);
      const { Name, SpeciesID, EnclosureID, Sex, DateOfBirth, AcquisitionDate } = body;
      const [result] = await pool.query(
        `UPDATE animal
         SET Name = ?, SpeciesID = ?, EnclosureID = ?, Sex = ?,
             DateOfBirth = ?, AcquisitionDate = ?
         WHERE AnimalID = ?`,
        [Name, SpeciesID, EnclosureID, Sex, DateOfBirth || null, AcquisitionDate, id]
      );


      if (result.affectedRows === 0) {
        return sendJson(res, 404, { error: "Animal not found" });
      }


      return sendJson(res, 200, { message: "Animal updated" });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 400, { error: error.message });
    }
  }


   // DELETE /api/animals/:id
   if (req.method === "DELETE" && id) {
    try {
      const [result] = await pool.query(
        "DELETE FROM animal WHERE AnimalID = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        return sendJson(res, 404, { error: "Animal not found" });
      }
      return sendJson(res, 200, { message: "Animal deleted" });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not delete animal" });
    }
  }
  sendJson(res, 404, { error: "Route not found" });
}
module.exports = { handleAnimals };