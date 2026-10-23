const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET /api/animals
router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT
        a.AnimalID,
        a.Name AS AnimalName,
        a.Sex,
        a.DateOfBirth,
        a.AcquisitionDate,
        s.CommonName AS Species,
        e.Name AS Enclosure
      FROM animal a
      JOIN species s ON a.SpeciesID = s.SpeciesID
      JOIN enclosure e ON a.EnclosureID = e.EnclosureID
      ORDER BY a.Name
    `);
      res.json(rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Could not get animals" });
    }
  });

  // GET /api/animals/search?species=Zebra
router.get("/search", async (req, res) => {
  const { species, enclosureId, sex } = req.query;

  try {
    let sql = `
      SELECT
        a.AnimalID,
        a.Name AS AnimalName,
        a.Sex,
        a.DateOfBirth,
        a.AcquisitionDate,
        s.CommonName AS Species,
        s.ConservationStatus,
        e.Name AS Enclosure,
        e.Status AS EnclosureStatus
      FROM animal a
      JOIN species s ON a.SpeciesID = s.SpeciesID
      JOIN enclosure e ON a.EnclosureID = e.EnclosureID
      WHERE 1 = 1
    `;

    const params = [];

    if (species) {
      sql += " AND s.CommonName LIKE ?";
      params.push(`%${species}%`);
    }

    if (enclosureId) {
      sql += " AND a.EnclosureID = ?";
      params.push(enclosureId);
    }

    if (sex) {
      sql += " AND a.Sex = ?";
      params.push(sex);
    }

    sql += " ORDER BY a.Name";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not search animals" });
  }
});


  // GET /api/animals/:id
router.get("/:id", async (req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM animal WHERE AnimalID = ?",
        [req.params.id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: "Animal not found" });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Could not get animal" });
    }
  });

  // POST /api/animals
router.post("/", async (req, res) => {
    const { Name, SpeciesID, EnclosureID, Sex, DateOfBirth, AcquisitionDate } = req.body;
    if (!Name || !SpeciesID || !EnclosureID || !Sex || !AcquisitionDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }


    try {
        const [result] = await pool.query(
          `INSERT INTO animal (Name, SpeciesID, EnclosureID, Sex, DateOfBirth, AcquisitionDate)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [Name, SpeciesID, EnclosureID, Sex, DateOfBirth || null, AcquisitionDate]
        );


        res.status(201).json({ AnimalID: result.insertId });
  } catch (error) {
    // capacity trigger shows up here as an error
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});


// PUT /api/animals/:id
router.put("/:id", async (req, res) => {
    const { Name, SpeciesID, EnclosureID, Sex, DateOfBirth, AcquisitionDate } = req.body;
  
    try {
        const [result] = await pool.query(
          `UPDATE animal
           SET Name = ?, SpeciesID = ?, EnclosureID = ?, Sex = ?,
               DateOfBirth = ?, AcquisitionDate = ?
           WHERE AnimalID = ?`,
          [
            Name,
            SpeciesID,
            EnclosureID,
            Sex,
            DateOfBirth || null,
            AcquisitionDate,
            req.params.id
          ]
        );
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Animal not found" });
        }
        res.json({ message: "Animal updated" });
      } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
      }
    });




// DELETE /api/animals/:id
router.delete("/:id", async (req, res) => {
    try {
      const [result] = await pool.query(
        "DELETE FROM animal WHERE AnimalID = ?",
        [req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Animal not found" });
      }
      res.json({ message: "Animal deleted" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Could not delete animal" });
    }
  });
  module.exports = router;