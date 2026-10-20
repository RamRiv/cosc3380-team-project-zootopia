
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Test the database connection
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

// Retrieve animal records
app.get("/api/animals", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM animal LIMIT 100"
        );

        res.json(rows);
    } catch (error) {
        console.error("Error retrieving animals:", error.message);
        res.status(500).json({ error: "Could not retrieve animals" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
