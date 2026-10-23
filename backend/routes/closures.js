const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /api/closures
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM zooclosure");
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not get closures" });
  }
});

// GET /api/closures/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM zooclosure WHERE ClosureID = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Closure not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not get closure" });
  }
});

// POST /api/closures
router.post("/", async (req, res) => {
  const { Date, Reason, Scope, EnclosureID } = req.body;

  if (!Date || !Reason || !Scope) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (Scope === "FullZoo" && EnclosureID != null) {
    return res.status(400).json({ error: "FullZoo closure cannot have EnclosureID" });
  }

  if (Scope === "Enclosure" && EnclosureID == null) {
    return res.status(400).json({ error: "Enclosure closure needs EnclosureID" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO zooclosure (\`Date\`, Reason, Scope, EnclosureID)
       VALUES (?, ?, ?, ?)`,
      [Date, Reason, Scope, EnclosureID ?? null]
    );

    res.status(201).json({ ClosureID: result.insertId });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/closures/:id
router.put("/:id", async (req, res) => {
  const { Date, Reason, Scope, EnclosureID } = req.body;

  if (Scope === "FullZoo" && EnclosureID != null) {
    return res.status(400).json({ error: "FullZoo closure cannot have EnclosureID" });
  }

  if (Scope === "Enclosure" && EnclosureID == null) {
    return res.status(400).json({ error: "Enclosure closure needs EnclosureID" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE zooclosure
       SET \`Date\` = ?, Reason = ?, Scope = ?, EnclosureID = ?
       WHERE ClosureID = ?`,
      [Date, Reason, Scope, EnclosureID ?? null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Closure not found" });
    }

    res.json({ message: "Closure updated" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/closures/:id
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM zooclosure WHERE ClosureID = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Closure not found" });
    }

    res.json({ message: "Closure deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not delete closure" });
  }
});

module.exports = router;