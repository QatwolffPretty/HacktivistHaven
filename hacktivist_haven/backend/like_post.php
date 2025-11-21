<?php
header('Content-Type: application/json');
require_once "db_connect.php";

if (!isset($_POST['id'])) {
    echo json_encode(["success" => false, "error" => "Missing post ID"]);
    exit;
}

$postId = intval($_POST['id']);

$query = "UPDATE admin_posts SET likes = likes + 1 WHERE id = $postId";
if ($conn->query($query)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}

$conn->close();
