const pool = require("../db");

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

async function handleTransactions(req, res, pathname) {
  // GET /api/my/transactions?customerId=1
  if (req.method === "GET" && pathname === "/api/my/transactions") {
    try {
      const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
      const customerId = url.searchParams.get("customerId");

      if (!customerId) {
        return sendJson(res, 400, { error: "customerId is required" });
      }

      const [transactions] = await pool.query(
        `SELECT
           t.TransactionID,
           t.CustomerID,
           t.Date,
           t.PaymentType,
           tk.TicketID,
           tk.Type AS TicketType,
           tk.UnitPrice AS TicketPrice,
           COALESCE(vt.TotalAmount, 0) AS TotalAmount
         FROM \`transaction\` t
         JOIN ticket tk
           ON tk.TransactionID = t.TransactionID
         LEFT JOIN v_transaction_totals vt
           ON vt.TransactionID = t.TransactionID
         WHERE t.CustomerID = ?
         ORDER BY t.Date DESC`,
        [customerId]
      );

      const result = [];

      for (const row of transactions) {
        const [products] = await pool.query(
          `SELECT
             tp.ProductID,
             p.Name AS ProductName,
             tp.Quantity,
             tp.UnitPrice
           FROM transactionproduct tp
           JOIN product p
             ON p.ProductID = tp.ProductID
           WHERE tp.TransactionID = ?`,
          [row.TransactionID]
        );

        result.push({
          transactionId: row.TransactionID,
          customerId: row.CustomerID,
          date: row.Date,
          paymentType: row.PaymentType,
          ticket: {
            ticketId: row.TicketID,
            type: row.TicketType,
            unitPrice: row.TicketPrice
          },
          products,
          totalAmount: row.TotalAmount
        });
      }

      return sendJson(res, 200, result);
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Could not get transactions" });
    }
  }

  sendJson(res, 404, { error: "Route not found" });
}

module.exports = { handleTransactions };