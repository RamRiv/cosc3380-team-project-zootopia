require("dotenv").config();
const express = require("express");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
//animal routes
const animalsRouter = require("./routes/animals");
app.use("/api/animals", animalsRouter);

//enclosure routes
const enclosuresRouter = require("./routes/enclosures");
app.use("/api/enclosures", enclosuresRouter);

//species routes
const speciesRouter = require("./routes/species");
app.use("/api/species", speciesRouter);

//shop routes
const shopsRouter = require("./routes/shops");
app.use("/api/shops", shopsRouter);

//product routes
const productsRouter = require("./routes/products");
app.use("/api/products", productsRouter);

// check db connection
app.get("/api/health", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ message: "Database connected!" });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});



app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});