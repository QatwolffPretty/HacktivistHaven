<?php
require_once __DIR__ . '/db_connect.php';
header('Content-Type: application/json; charset=utf-8');

$sql = "SELECT id, title, content, tag, author, created_at, updatedAt, image, comments, likes, pinned, deleted
        FROM admin_posts
        ORDER BY pinned DESC, created_at DESC";
$result = $conn->query($sql);

$posts = [];
while ($row = $result->fetch_assoc()) {
    // normalize fields
    $row['author_name'] = $row['author'] ?? 'Guest';
    // comments store as JSON string; ensure it's valid JSON string
    if (empty($row['comments'])) {
        $row['comments'] = "[]";
    } else {
        // try to ensure valid JSON string
        $decoded = json_decode($row['comments'], true);
        $row['comments'] = ($decoded === null && json_last_error() !== JSON_ERROR_NONE) ? '[]' : json_encode($decoded);
    }
    $row['likes'] = intval($row['likes'] ?? 0);
    $row['deleted'] = intval($row['deleted'] ?? 0);
    $posts[] = $row;
}

echo json_encode($posts, JSON_UNESCAPED_UNICODE);
$conn->close();