const pool = require("../db");

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json"
  });
  res.end(JSON.stringify(data));
}

async function handleReports(req, res, pathname) {
  // GET /api/reports/enclosure-occupancy
  if (
    req.method === "GET" &&
    pathname === "/api/reports/enclosure-occupancy"
  ) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM v_enclosure_occupancy
        ORDER BY CapacityPercentage DESC`
      );

      return sendJson(res, 200, rows);
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, {
        error: "Could not get enclosure occupancy report"
      });
    }
  }

  // GET /api/reports/product_sales
  if (
    req.method === "GET" &&
    pathname === "/api/reports/product-sales"
  ) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM v_product_sales
        ORDER BY Revenue DESC`
        );

      return sendJson(res, 200, rows);
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, {
        error: "Could not get product sales report"
      });
    }
  }

  return sendJson(res, 404, { error: "Report not found" });
}

module.exports = { handleReports };