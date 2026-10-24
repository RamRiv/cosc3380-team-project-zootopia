require("dotenv").config();
const http = require("http");
const pool = require("./db");

const PORT = process.env.PORT || 3000;

// animal route
const { handleAnimals } = require("./routes/animals");

// enclosure route
const { handleEnclosures } = require("./routes/enclosures");

// species route
const { handleSpecies } = require("./routes/species");

// shops route
const { handleShops } = require("./routes/shops");

// products route
const { handleProducts } = require("./routes/products");

// attractions route
const { handleAttractions } = require("./routes/attractions");

// closures route
const { handleClosures } = require("./routes/closures");

// auth route
const { handleAuth } = require("./routes/auth");

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  // GET /api/health
  if (req.method === "GET" && pathname === "/api/health") {
    try {
      const connection = await pool.getConnection();
      connection.release();
      return sendJson(res, 200, { message: "Database connected!" });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Database connection failed" });
    }
  }


  if (pathname === "/api/animals" || pathname.startsWith("/api/animals/")) {
    return handleAnimals(req, res, pathname);
  }

  if (pathname === "/api/enclosures" || pathname.startsWith("/api/enclosures/")) {
    return handleEnclosures(req, res, pathname);
  }
  
  if (pathname === "/api/species" || pathname.startsWith("/api/species/")) {
    return handleSpecies(req, res, pathname);
  }

  if (pathname === "/api/shops" || pathname.startsWith("/api/shops/")) {
    return handleShops(req, res, pathname);
  }

  if (pathname === "/api/products" || pathname.startsWith("/api/products/")) {
    return handleProducts(req, res, pathname);
  }

  if (pathname === "/api/attractions" || pathname.startsWith("/api/attractions/")) {
    return handleAttractions(req, res, pathname);
  }

  if (pathname === "/api/closures" || pathname.startsWith("/api/closures/")) {
    return handleClosures(req, res, pathname);
  }


  if (pathname === "/api/login" || pathname === "/api/signup") {
    return handleAuth(req, res, pathname);
  }

  sendJson(res, 404, { error: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});