<?php
session_start();

// ✅ Enforce login
if (!isset($_SESSION['admin_signed']) || $_SESSION['admin_signed'] !== true) {
    header("Location: signin.html");
    exit();
}

// ✅ Get Admin Display Name
$adminUser = $_SESSION['adminUser'] ?? [
    "fullname" => "Administrator",
    "username" => "Admin"
];

// ✅ Generate initials for avatar
$initials = strtoupper(substr($adminUser["fullname"], 0, 2));
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Admin Dashboard - Hacktivist Haven</title>
  <link rel="stylesheet" href="admin-dashboard.css" />
  <link rel="icon" type="image/x-icon" href="forum-bg.png" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
  <div class="wrap">
    <div class="container">
      <header>
        <div class="brand">
          <h1>Hacktivist Haven</h1>
          <div class="lead">Admin Dashboard · Control Center</div>
        </div>
        <nav>
          <a class="nav-link" href="community.html">Community</a>
          <a class="nav-link nav-primary" href="backend/logout-admin.php">Log out</a>
        </nav>
      </header>

      <div class="layout">
        <div class="panel sidebar">
          <div class="profile">
            <div class="avatar"><?= $initials ?></div>
            <div>
              <div class="greet">Hello, <div class="name"><?= htmlspecialchars($adminUser["fullname"]) ?></div></div>
              <div class="muted">Administrator</div>
            </div>
          </div>

          <div class="side-nav">
            <button class="side-btn active" data-view="dashboard">Dashboard</button>
            <button class="side-btn" data-view="posts">Announcements</button>
            <button class="side-btn" data-view="community">Community</button>
            <button class="side-btn" data-view="income">Income</button>
            <button class="side-btn" data-view="classnotes">Class Notes</button>
            <button class="side-btn" data-view="leaderboard">Leaderboard</button>
            <button class="side-btn" data-view="quiz">Quiz</button>
            <button class="side-btn" data-view="mail">Mail</button>
            <button class="side-btn logout" data-view="logout">Logout</button>
          </div>
        </div>

        <main class="panel" id="mainPanel"></main>

        <aside>
          <div class="chart-wrap panel">
            <div class="muted">Income Overview</div>
            <canvas id="incomeChart" width="220" height="220"></canvas>
            <div style="margin-top:10px"><strong id="incomeText">RM 0.00</strong></div>
          </div>

          <div style="margin-top:12px" class="panel">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <strong>Recent Announcements</strong>
              <small class="muted">Pinned</small>
            </div>
            <div class="notes" id="recentPosts"></div>
          </div>
        </aside>
      </div>
    </div>
  </div>

<script src="admin-dashboard.js"></script>
</body>
</html>
