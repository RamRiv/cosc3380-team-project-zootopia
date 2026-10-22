require("dotenv").config();
const http = require("http");
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    const url = new URL(
        req.url,
        `http://${req.headers.host || "localhost"}`
    );

    // Test the database connection
    if (req.method === "GET" && url.pathname === "/api/health") {
        try {
            const connection = await pool.getConnection();
            connection.release();

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Database connected!"
            }));
        } catch (error) {
            console.error(
                "Database connection failed:",
                error.message
            );

            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: "Database connection failed"
            }));
        }

        return;
    }

    // Retrieve animal records
    if (req.method === "GET" && url.pathname === "/api/animals") {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM animal LIMIT 100"
            );

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(rows));
        } catch (error) {
            console.error(
                "Error retrieving animals:",
                error.message
            );

            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: "Could not retrieve animals"
            }));
        }

        return;
    }

    // Handle unknown routes
    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        error: "Route not found"
    }));
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
