const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /api/attractions
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM attraction");
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not get attractions" });
  }
});

// GET /api/attractions/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM attraction WHERE AttractionID = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Attraction not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not get attraction" });
  }
});

// POST /api/attractions
router.post("/", async (req, res) => {
  const { Name, Type, Schedule, EnclosureID } = req.body;

  if (!Name || !Type || !Schedule || !EnclosureID) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO attraction (Name, Type, Schedule, EnclosureID)
       VALUES (?, ?, ?, ?)`,
      [Name, Type, Schedule, EnclosureID]
    );

    res.status(201).json({ AttractionID: result.insertId });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/attractions/:id
router.put("/:id", async (req, res) => {
  const { Name, Type, Schedule, EnclosureID } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE attraction
       SET Name = ?, Type = ?, Schedule = ?, EnclosureID = ?
       WHERE AttractionID = ?`,
      [Name, Type, Schedule, EnclosureID, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Attraction not found" });
    }

    res.json({ message: "Attraction updated" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/attractions/:id
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM attraction WHERE AttractionID = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Attraction not found" });
    }

    res.json({ message: "Attraction deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not delete attraction" });
  }
});

module.exports = router;