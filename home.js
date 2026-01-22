const express = require("express");
const app = express();

/* HOME PAGE */
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>E-Learning Platform</title>

<style>
body {
  margin: 0;
  font-family: Arial;
  background: linear-gradient(to right, #1e3c72, #2a5298);
  color: white;
  text-align: center;
}
.card {
  background: white;
  color: black;
  width: 300px;
  margin: 20px auto;
  padding: 25px;
  border-radius: 10px;
}
button {
  padding: 10px 20px;
  background: #1e3c72;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
</head>

<body>

<h1>Smart E-Learning Platform</h1>

<div class="card">
  <h3>User</h3>
  <button onclick="window.location.href='http://localhost:3003'">
    Login as User
  </button>
</div>

<div class="card">
  <h3>Admin</h3>
  <button onclick="window.location.href='http://localhost:3006'">
    Login as Admin
  </button>
</div>

</body>
</html>
`);
});

/* SERVER */
app.listen(3009, () => {
  console.log("Home running at http://localhost:3009");
});
