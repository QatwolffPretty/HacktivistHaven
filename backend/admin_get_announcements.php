<?php
require_once "db_connect.php";
header('Content-Type: application/json');

// Fetch ALL posts (both deleted & active)
$sql = "SELECT * FROM admin_posts WHERE deleted = 0
        ORDER BY created_at DESC";
$result = $conn->query($sql);

$posts = [];
while ($row = $result->fetch_assoc()) {
    $posts[] = $row;
}

echo json_encode($posts);
