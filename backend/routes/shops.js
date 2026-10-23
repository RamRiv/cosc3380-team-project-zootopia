const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /api/shops
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM shop");
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not get shops" });
  }
});

// GET /api/shops/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM shop WHERE ShopID = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not get shop" });
  }
});

// POST /api/shops
router.post("/", async (req, res) => {
  const { Name, Location, ShopType } = req.body;

  if (!Name || !Location || !ShopType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO shop (Name, Location, ShopType) VALUES (?, ?, ?)",
      [Name, Location, ShopType]
    );

    res.status(201).json({ ShopID: result.insertId });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/shops/:id
router.put("/:id", async (req, res) => {
  const { Name, Location, ShopType } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE shop
       SET Name = ?, Location = ?, ShopType = ?
       WHERE ShopID = ?`,
      [Name, Location, ShopType, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.json({ message: "Shop updated" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/shops/:id
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM shop WHERE ShopID = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.json({ message: "Shop deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not delete shop" });
  }
});

module.exports = router;