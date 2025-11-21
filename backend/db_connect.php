<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

// ✅ Correct DB Config
$host = "localhost";
$username = "root";
$password = "";
$dbname = "hacktivist_haven";

// ❗ FIXED — must use $dbname, NOT $database
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "DB Connection Failed: " . $conn->connect_error]);
    exit;
}
?>
