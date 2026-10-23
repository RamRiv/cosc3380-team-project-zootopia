const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /api/species
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM species");
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not get species" });
  }
});

// GET /api/species/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM species WHERE SpeciesID = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Species not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not get species" });
  }
});

// POST /api/species
router.post("/", async (req, res) => {
  const { CommonName, ScientificName, Diet, ConservationStatus, AvgLifespan } = req.body;

  if (!CommonName || !ScientificName || !Diet || !ConservationStatus) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO species (CommonName, ScientificName, Diet, ConservationStatus, AvgLifespan)
       VALUES (?, ?, ?, ?, ?)`,
      [CommonName, ScientificName, Diet, ConservationStatus, AvgLifespan || null]
    );

    res.status(201).json({ SpeciesID: result.insertId });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/species/:id
router.put("/:id", async (req, res) => {
  const { CommonName, ScientificName, Diet, ConservationStatus, AvgLifespan } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE species
       SET CommonName = ?, ScientificName = ?, Diet = ?,
           ConservationStatus = ?, AvgLifespan = ?
       WHERE SpeciesID = ?`,
      [
        CommonName,
        ScientificName,
        Diet,
        ConservationStatus,
        AvgLifespan || null,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Species not found" });
    }

    res.json({ message: "Species updated" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/species/:id
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM species WHERE SpeciesID = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Species not found" });
    }

    res.json({ message: "Species deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not delete species" });
  }
});

module.exports = router;