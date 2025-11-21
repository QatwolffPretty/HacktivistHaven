<?php
header('Content-Type: application/json');
require_once "db_connect.php";

if (!isset($_POST['id'])) {
    echo json_encode(["success" => false, "error" => "No ID provided"]);
    exit;
}

$id = intval($_POST['id']);

// Delete from admin_posts
$conn->query("UPDATE admin_posts SET deleted = 1 WHERE id = $id");

// Also delete from community_posts (match by title & content for sync)
$conn->query("
    UPDATE community_posts
    SET deleted = 1
    WHERE title = (SELECT title FROM admin_posts WHERE id = $id LIMIT 1)
");

// Done
echo json_encode(["success" => true]);
$conn->close();
