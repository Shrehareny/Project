const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "elearn-secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Temporary enrollment storage (username => course)
const enrollments = {};

// Middleware to check login
function checkLogin(req, res, next) {
  if (!req.session.username) {
    return res.redirect("/login");
  }
  next();
}

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, "public")));

// Login page
app.get("/login", (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form method="POST" action="/login">
      <input name="username" placeholder="Enter your name" required />
      <button>Login</button>
    </form>
  `);
});

// Handle login
app.post("/login", (req, res) => {
  const username = req.body.username.trim();
  if (!username) {
    return res.send("Please provide a username. <a href='/login'>Try again</a>");
  }
  req.session.username = username;
  res.redirect("/dashboard");
});

// Dashboard page
app.get("/dashboard", checkLogin, (req, res) => {
  const username = req.session.username;
  const enrolledCourse = enrollments[username] || "";

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>User Dashboard - Courses</title>
  <style>
    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .dashboard {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 30px 40px;
      width: 400px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
      text-align: center;
    }
    h1 {
      margin-bottom: 15px;
    }
    select, button {
      width: 100%;
      padding: 12px 15px;
      margin: 15px 0;
      border-radius: 8px;
      border: none;
      font-size: 16px;
    }
    select {
      background-color: #fff;
      color: #333;
      cursor: pointer;
    }
    button {
      background: #ffb347;
      font-weight: 700;
      color: #333;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    button:hover {
      background: #ffa500;
    }
    .enrolled-message {
      font-size: 18px;
      margin-top: 20px;
      font-weight: bold;
    }
    .logout-btn {
      background: transparent;
      border: 1.5px solid #fff;
      color: #fff;
      font-weight: 600;
      margin-top: 25px;
      cursor: pointer;
      padding: 10px 0;
      border-radius: 6px;
      width: 100%;
      transition: background 0.3s ease, color 0.3s ease;
    }
    .logout-btn:hover {
      background: #fff;
      color: #764ba2;
    }
  </style>
</head>
<body>
  <div class="dashboard">
    <h1>Welcome, ${username}!</h1>
    ${
      enrolledCourse
        ? `<div class="enrolled-message">You are enrolled in: ${enrolledCourse}</div>`
        : `
          <form method="POST" action="/enroll">
            <select name="course" required>
              <option value="">Select Course</option>
              <option>Cloud Computing</option>
              <option>Web Development</option>
              <option>Machine Learning</option>
              <option>DevOps</option>
            </select>
            <button>Enroll</button>
          </form>
        `
    }
    <form method="GET" action="/logout">
      <button type="submit" class="logout-btn">Logout</button>
    </form>
  </div>
</body>
</html>
  `);
});

// Handle enrollment
app.post("/enroll", checkLogin, (req, res) => {
  const username = req.session.username;
  const course = req.body.course;
  enrollments[username] = course;
  res.redirect("/dashboard");
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Root redirect
app.get("/", (req, res) => {
  if (req.session.username) {
    return res.redirect("/dashboard");
  }
  res.redirect("/login");
});

// Start server
app.listen(3007, () => {
  console.log("Server running on http://localhost:3007");
});
