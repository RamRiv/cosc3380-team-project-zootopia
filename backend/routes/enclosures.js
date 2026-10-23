const express = require("express");
const pool = require("../db");

const router = express.Router();


// GET /api/enclosures
router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM enclosure");
      res.json(rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Could not get enclosures" });
    }
  });


// GET /api/enclosures/:id
router.get("/:id", async (req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM enclosure WHERE EnclosureID = ?",
        [req.params.id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: "Enclosure not found" });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Could not get enclosure" });
    }
  });


  // POST /api/enclosures
  router.post("/", async (req, res) => {
    const { Name, HabitatType, Capacity, Location, Status } = req.body;
    if (!Name || !HabitatType || !Capacity || !Location || !Status) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      const [result] = await pool.query(
        `INSERT INTO enclosure (Name, HabitatType, Capacity, Location, Status)
         VALUES (?, ?, ?, ?, ?)`,
        [Name, HabitatType, Capacity, Location, Status]
      );
      res.status(201).json({ EnclosureID: result.insertId });
    } catch (error) {
      console.error(error.message);
      res.status(400).json({ error: error.message });
    }
  });


  // PUT /api/enclosures/:id
  router.put("/:id", async (req, res) => {
    const { Name, HabitatType, Capacity, Location, Status } = req.body;
    try {
      const [result] = await pool.query(
        `UPDATE enclosure
         SET Name = ?, HabitatType = ?, Capacity = ?, Location = ?, Status = ?
         WHERE EnclosureID = ?`,
        [Name, HabitatType, Capacity, Location, Status, req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Enclosure not found" });
      }
      res.json({ message: "Enclosure updated" });
    } catch (error) {
      console.error(error.message);
      res.status(400).json({ error: error.message });
    }
  });


  // DELETE /api/enclosures/:id
  router.delete("/:id", async (req, res) => {
    try {
      const [result] = await pool.query(
        "DELETE FROM enclosure WHERE EnclosureID = ?",
        [req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Enclosure not found" });
      }
      res.json({ message: "Enclosure deleted" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Could not delete enclosure" });
    }
  });

  module.exports = router;