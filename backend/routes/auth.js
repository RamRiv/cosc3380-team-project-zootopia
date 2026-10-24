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
        const { username, password } = body;
        if (!username || !password) {
          return sendJson(res, 400, { error: "Username and password required" });
        }
        const [rows] = await pool.query(
          `SELECT UserID, Username, Role, EmployeeID, CustomerID
           FROM users
           WHERE Username = ? AND Password = ?`,
          [username, password]
        );

        if (rows.length === 0) {
            return sendJson(res, 401, { error: "Invalid username or password" });
          }
          const user = rows[0];
          return sendJson(res, 200, {
            username: user.Username,
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
          const { email, password } = body;
          if (!email || !password) {
            return sendJson(res, 400, { error: "Email and password required" });
          }

          // if its a custome who logged in before
          const [existingCustomer] = await pool.query(
            "SELECT CustomerID FROM customer WHERE Email = ?",
            [email]
          );
          if (existingCustomer.length > 0) {
            return sendJson(res, 400, { error: "An account with that email already exists" });
          }


          // username already in use

          const [existingUser] = await pool.query(
            "SELECT UserID FROM users WHERE Username = ?",
            [email]
          );
          if (existingUser.length > 0) {
            return sendJson(res, 400, { error: "That login is already taken" });
          }


          // a customer shouldn't be able to create an account with an employee email
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
            [email, password, customerId]
          );

          return sendJson(res, 201, {
            username: email,
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

