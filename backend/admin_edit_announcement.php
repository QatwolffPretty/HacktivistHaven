<?php
header('Content-Type: application/json');
require_once "db_connect.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data['id']);
$title = trim($data['title']);
$content = trim($data['content']);

if (!$id || !$title || !$content) {
    echo json_encode(["success" => false, "error" => "Invalid input"]);
    exit();
}

$stmt = $conn->prepare("UPDATE admin_posts SET title = ?, content = ? WHERE id = ?");
$stmt->bind_param("ssi", $title, $content, $id);
$result = $stmt->execute();

echo json_encode(["success" => $result]);
