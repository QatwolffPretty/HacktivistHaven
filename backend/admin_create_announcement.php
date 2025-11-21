<?php
session_start();
require_once "db_connect.php";
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$title = trim($data['title'] ?? '');
$content = trim($data['content'] ?? '');
$tag = trim($data['tag'] ?? 'General');
$author = $_SESSION['adminUser']['username'] ?? 'Admin';
$image = NULL;
$comments = "[]";

if (!$title || !$content) {
    echo json_encode(["success" => false, "error" => "Missing fields"]);
    exit();
}

$stmt = $conn->prepare("
    INSERT INTO admin_posts (title, content, tag, author, image, comments, pinned, likes, deleted, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, NOW(), NOW())
");
$stmt->bind_param("ssssss", $title, $content, $tag, $author, $image, $comments);
$stmt->execute();

echo json_encode(["success" => true]);
$conn->close();
exit();
?>
