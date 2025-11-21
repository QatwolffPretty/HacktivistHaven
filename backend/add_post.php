<?php
require_once __DIR__ . '/db_connect.php';
header('Content-Type: application/json; charset=utf-8');

$title   = $_POST['title'] ?? '';
$content = $_POST['content'] ?? '';
$tag     = $_POST['tag'] ?? 'general';
$author  = $_POST['author'] ?? 'Guest';
$image   = $_POST['image'] ?? null;
$likes   = 0;
$comments = "[]";

$stmt = $conn->prepare("INSERT INTO admin_posts (title, content, tag, author, image, likes, comments, createdAt)
                        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");

$stmt->bind_param("sssssis", $title, $content, $tag, $author, $image, $likes, $comments);

if($stmt->execute()){
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}
