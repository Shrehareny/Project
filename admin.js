const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// ================= DATABASE =================
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

// ================= AUTO SCALING =================
let servers = 1;
let scalingLog = [];

const MAX_USERS_PER_SERVER = 10;
const CPU_THRESHOLD = 70;

function getActiveUsersCount() {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS count FROM user1", (err, results) => {
      if (err) reject(err);
      else resolve(results[0].count);
    });
  });
}

function calculateCpuLoad(activeUsers) {
  return Math.min((activeUsers / (servers * MAX_USERS_PER_SERVER)) * 100, 100);
}

async function autoScale() {
  try {
    const activeUsers = await getActiveUsersCount();
    const cpu = calculateCpuLoad(activeUsers);

    if (cpu > CPU_THRESHOLD) {
      servers++;
      scalingLog.unshift(`[AUTO] High CPU ${cpu.toFixed(2)}% → Servers: ${servers}`);
    } else if (cpu < CPU_THRESHOLD / 2 && servers > 1) {
      servers--;
      scalingLog.unshift(`[AUTO] Low CPU ${cpu.toFixed(2)}% → Servers: ${servers}`);
    }
  } catch (err) {
    console.error(err);
  }
}

setInterval(autoScale, 5000);

// ================= FILE UPLOAD =================
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    // Include course name in filename
    cb(null, Date.now() + "_" + req.body.course + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ================= DASHBOARD =================
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Admin Dashboard</title>
<style>
body { margin:0; font-family:Arial; background:#f4f6f9; }
.header { background:#ff7e5f; color:white; padding:15px 30px; font-size:22px; }
.container { display:flex; }
.sidebar { width:220px; background:#2f3542; min-height:100vh; }
.sidebar a { display:block; padding:12px 20px; color:white; text-decoration:none; }
.sidebar a:hover { background:#57606f; }
.content { flex:1; padding:30px; }
.card { background:white; padding:20px; border-radius:8px; margin-bottom:20px; }
button { padding:10px; background:#185a9d; color:white; border:none; cursor:pointer; }
table { width:100%; border-collapse:collapse; }
th, td { border:1px solid #ccc; padding:8px; }
th { background:#667eea; color:white; }
</style>
</head>
<body>

<div class="header">Admin Dashboard</div>

<div class="container">
  <div class="sidebar">
    <a href="/">Dashboard</a>
    <a href="/users">Users</a>
    <a href="/courses">Courses</a>
    <a href="/logout">Logout</a>
  </div>

  <div class="content">
    <div class="card">
      <h3>System Stats</h3>
      <p>Active Users: <span id="users">0</span></p>
      <p>Servers Running: <span id="servers">1</span></p>
      <p>CPU Load: <span id="cpu">0%</span></p>
    </div>

    <div class="card">
      <h3>Scaling Log</h3>
      <div id="log"></div>
    </div>
  </div>
</div>

<script>
async function updateStats(){
  const res = await fetch("/stats");
  const data = await res.json();
  users.innerText = data.activeUsers;
  servers.innerText = data.servers;
  cpu.innerText = data.cpuLoad.toFixed(2)+"%";
  log.innerHTML = data.log.map(l => "<div>"+l+"</div>").join("");
}
setInterval(updateStats,1000);
</script>

</body>
</html>
`);
});

// ================= USERS PAGE =================
app.get("/users", (req, res) => {
  db.query("SELECT name,email,role FROM user1", (err, users) => {
    if (err) return res.send("DB Error");

    const rows = users.map(
      u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td></tr>`
    ).join("");

    res.send(`
    <h2>All Users</h2>
    <table>
      <tr><th>Name</th><th>Email</th><th>Role</th></tr>
      ${rows}
    </table>
    <br><a href="/">Back</a>
    `);
  });
});

// ================= COURSES PAGE =================
app.get("/courses", (req, res) => {
  const courses = ["Web Development", "Cloud Computing", "Machine Learning", "DevOps"];
  const listItems = courses.map(c => `<li><a href="/upload-course?course=${encodeURIComponent(c)}">${c}</a></li>`).join("");

  res.send(`
    <h2>Available Courses</h2>
    <ul>
      ${listItems}
    </ul>
    <br>
    <a href="/">Back to Dashboard</a>
  `);
});

// ================= UPLOAD FORM FOR A COURSE =================
app.get("/upload-course", (req, res) => {
  const course = req.query.course;
  if (!course) return res.redirect("/courses");

  res.send(`
    <h2>Upload File for ${course}</h2>
    <form method="POST" action="/upload-course" enctype="multipart/form-data">
      <input type="hidden" name="course" value="${course}" />
      <input type="file" name="file" required><br><br>
      <button>Upload</button>
    </form>
    <br><a href="/courses">Back to Courses</a>
  `);
});

// ================= HANDLE FILE UPLOAD =================
app.post("/upload-course", upload.single("file"), (req, res) => {
  const course = req.body.course;
  res.send(`
    <p>File uploaded successfully for course: <b>${course}</b></p>
    <a href="/uploads/${req.file.filename}" target="_blank">View File</a><br><br>
    <a href="/courses">Back to Courses</a>
  `);
});

// ================= LOGOUT =================
app.get("/logout", (req, res) => {
  res.send(`
    <h2>You are logged out</h2>
    <a href="/">Login Again</a>
  `);
});

// ================= STATS API =================
app.get("/stats", async (req, res) => {
  const activeUsers = await getActiveUsersCount();
  const cpuLoad = calculateCpuLoad(activeUsers);
  res.json({ activeUsers, servers, cpuLoad, log: scalingLog });
});

// ================= START =================
app.listen(3006, () =>
  console.log("Admin Dashboard running at http://localhost:3006")
);
