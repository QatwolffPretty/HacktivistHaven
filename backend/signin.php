<?php
session_start();
require_once "db_connect.php";

// Ensure POST request only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Invalid request"]);
    exit();
}

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';
$role = $_POST['role'] ?? 'student';

if (!$username || !$password) {
    echo json_encode(["success" => false, "error" => "Missing fields"]);
    exit();
}

// ✅ Query new USERS table
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? LIMIT 1");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "User not found"]);
    exit();
}

$user = $result->fetch_assoc();

// ✅ Check password (MD5 hashed)
if ($user['password'] !== md5($password)) {
    echo json_encode(["success" => false, "error" => "Invalid password"]);
    exit();
}

// ✅ Check login type (role match)
if ($user['role'] !== $role) {
    echo json_encode(["success" => false, "error" => "Incorrect login tab for this account"]);
    exit();
}

// ✅ Set session information
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];
$_SESSION['fullname'] = $user['fullname'];
$_SESSION['role'] = $user['role'];

if ($role === 'admin') {
    $_SESSION['admin_signed'] = true;
    $_SESSION['adminUser'] = [
        "id" => $user['id'],
        "fullname" => $user['fullname'],
        "username" => $user['username']
    ];
    echo json_encode(["success" => true, "redirect" => "/hacktivist_haven/admin-dashboard.php"]);
    exit();
}

$_SESSION['student_signed'] = true;
echo json_encode(["success" => true, "redirect" => "../student-dashboard.php"]);
exit();
