const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM product");
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not get products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM product WHERE ProductID = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not get product" });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  const { Name, Price, Category, QuantityInStock, ShopID } = req.body;

  if (!Name || Price == null || !Category || QuantityInStock == null || !ShopID) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO product (Name, Price, Category, QuantityInStock, ShopID)
       VALUES (?, ?, ?, ?, ?)`,
      [Name, Price, Category, QuantityInStock, ShopID]
    );

    res.status(201).json({ ProductID: result.insertId });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  const { Name, Price, Category, QuantityInStock, ShopID } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE product
       SET Name = ?, Price = ?, Category = ?, QuantityInStock = ?, ShopID = ?
       WHERE ProductID = ?`,
      [Name, Price, Category, QuantityInStock, ShopID, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM product WHERE ProductID = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Could not delete product" });
  }
});

module.exports = router;