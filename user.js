const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

/* ================= DATABASE CONNECTION ================= */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shrehareny@12",
  database: "elearn"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});

/* ================= EMAIL VALIDATION ================= */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/* ================= AUTH PAGE ================= */
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>E-Learning Auth</title>
<style>
body {
  font-family: Arial;
  background: linear-gradient(135deg,#667eea,#764ba2);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
form {
  background: #fff;
  padding: 25px;
  width: 320px;
  margin: 10px;
  border-radius: 8px;
}
input, select, button {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
}
button {
  background: #667eea;
  color: white;
  border: none;
  cursor: pointer;
}
h3 { text-align: center; }
</style>
</head>
<body>

<form method="POST" action="/signup">
<h3>Signup</h3>
<input name="name" required placeholder="Name">
<input type="email" name="email" required placeholder="Email">
<input type="password" name="password" required placeholder="Password">
<select name="role" required>
  <option value="">Select Role</option>
  <option value="user">User</option>
  
</select>
<button>Signup</button>
</form>

<form method="POST" action="/login">
<h3>Login</h3>
<input type="email" name="email" required placeholder="Email">
<input type="password" name="password" required placeholder="Password">
<select name="role" required>
  <option value="">Select Role</option>
  <option value="user">User</option>
  
</select>
<button>Login</button>
</form>

</body>
</html>
`);
});

/* ================= SIGNUP ================= */
app.post("/signup", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!isValidEmail(email)) {
    return res.send("Invalid Email <a href='/'>Back</a>");
  }

  const sql = "INSERT INTO user1 (name,email,password,role) VALUES (?,?,?,?)";

  db.query(sql, [name, email, password, role], (err) => {
    if (err) return res.send("User already exists <a href='/'>Back</a>");

    if (role === "user") {
      // Redirect ONLY to port 3004
      res.redirect("http://localhost:3007");
    } else {
      res.send("Admin registered <a href='/'>Login</a>");
    }
  });
});

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  const sql = "SELECT * FROM user1 WHERE email=? AND password=? AND role=?";

  db.query(sql, [email, password, role], (err, result) => {
    if (err) return res.send("Error occurred <a href='/'>Back</a>");

    if (result.length > 0) {
      if (role === "user") {
        // Redirect ONLY to port 3004
        res.redirect("http://localhost:3007");
      } else {
        res.send(`
          <h2>Admin Dashboard</h2>
          <p>Welcome Admin ${result[0].name}</p>
          <a href="/">Logout</a>
        `);
      }
    } else {
      res.send("Invalid Login <a href='/'>Try Again</a>");
    }
  });
});

/* ================= SERVER ================= */
app.listen(3003, () => {
  console.log("Auth Server running on http://localhost:3003");
});
