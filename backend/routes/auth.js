const pool = require("../db");

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

async function handleAuth(req, res, pathname) {
  // POST /api/login
  if (req.method === "POST" && pathname === "/api/login") {
    try {
      const body = await readBody(req);
      const username = (body.username || "").trim();
      const password = body.password;

      if (!username || !password) {
        return sendJson(res, 400, { error: "Username and password required" });
      }

      const [rows] = await pool.query(
        `SELECT u.UserID, u.Username, u.Role, u.EmployeeID, u.CustomerID, c.Email
         FROM users u
         LEFT JOIN customer c ON u.CustomerID = c.CustomerID
         LEFT JOIN employee e ON u.EmployeeID = e.EmployeeID
         WHERE u.Username = ?
           AND u.Password = ?
           AND u.IsDeleted = 0
           AND (u.CustomerID IS NULL OR c.IsDeleted = 0)
           AND (u.EmployeeID IS NULL OR e.IsDeleted = 0)`,
        [username, password]
      );

      if (rows.length === 0) {
        return sendJson(res, 401, { error: "Invalid username or password" });
      }

      const user = rows[0];
      return sendJson(res, 200, {
        username: user.Username,
        email: user.Email || null,
        role: user.Role,
        employeeId: user.EmployeeID,
        customerId: user.CustomerID
      });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Login failed" });
    }
  }

  // POST /api/signup  (customers only)
  if (req.method === "POST" && pathname === "/api/signup") {
    try {
      const body = await readBody(req);
      const username = (body.username || "").trim();
      const email = (body.email || "").trim();
      const password = body.password;

      if (!username || !email || !password) {
        return sendJson(res, 400, { error: "Username, email, and password required" });
      }

      const [existingCustomer] = await pool.query(
        "SELECT CustomerID FROM customer WHERE Email = ?",
        [email]
      );
      if (existingCustomer.length > 0) {
        return sendJson(res, 400, { error: "An account with that email already exists" });
      }

      const [existingUser] = await pool.query(
        "SELECT UserID FROM users WHERE Username = ?",
        [username]
      );
      if (existingUser.length > 0) {
        return sendJson(res, 400, { error: "That login is already taken" });
      }

      const [existingEmployee] = await pool.query(
        "SELECT EmployeeID FROM employee WHERE EmailAddress = ?",
        [email]
      );
      if (existingEmployee.length > 0) {
        return sendJson(res, 400, { error: "Invalid email address" });
      }

      const [customerResult] = await pool.query(
        "INSERT INTO customer (Email) VALUES (?)",
        [email]
      );
      const customerId = customerResult.insertId;

      await pool.query(
        `INSERT INTO users (Username, Password, Role, EmployeeID, CustomerID)
         VALUES (?, ?, 'Customer', NULL, ?)`,
        [username, password, customerId]
      );

      return sendJson(res, 201, {
        username: username,
        email: email,
        role: "Customer",
        customerId: customerId
      });
    } catch (error) {
      console.error(error.message);
      return sendJson(res, 500, { error: "Signup failed" });
    }
  }

  sendJson(res, 404, { error: "Route not found" });
}

module.exports = { handleAuth };