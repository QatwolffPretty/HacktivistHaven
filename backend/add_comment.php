<?php
header('Content-Type: application/json');
require_once "db_connect.php";

if (!isset($_POST['post_id']) || !isset($_POST['author']) || !isset($_POST['text'])) {
    echo json_encode(["success" => false, "error" => "Missing fields"]);
    exit;
}

$postId = intval($_POST['post_id']);
$author = trim($_POST['author']);
$text = trim($_POST['text']);
$time = date("Y-m-d H:i:s");

// Get current comments
$query = "SELECT comments FROM admin_posts WHERE id = $postId LIMIT 1";
$result = $conn->query($query);
$row = $result->fetch_assoc();

$current = json_decode($row['comments'], true);
if (!is_array($current)) $current = [];

// Add new comment
$current[] = [
    "author" => $author,
    "text" => $text,
    "at" => $time
];

// Save updated JSON
$newComments = $conn->real_escape_string(json_encode($current));
$updateQuery = "UPDATE admin_posts SET comments = '$newComments' WHERE id = $postId";

if ($conn->query($updateQuery)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}

$conn->close();
