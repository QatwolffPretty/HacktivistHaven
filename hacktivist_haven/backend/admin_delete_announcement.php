<?php
session_start();
require_once "db_connect.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["success" => false, "error" => "Missing Post ID"]);
    exit();
}

$id = intval($data['id']);

// ✅ Soft delete in admin_posts
$query1 = "UPDATE admin_posts SET deleted = 1 WHERE id = $id";
$conn->query($query1);

// ✅ Soft delete in community_posts
$query2 = "UPDATE community_posts SET deleted = 1 WHERE admin_post_id = $id";
$conn->query($query2);

echo json_encode(["success" => true]);
exit();
?>
