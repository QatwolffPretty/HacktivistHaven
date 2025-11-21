<?php
header('Content-Type: application/json; charset=utf-8');
require_once "db_connect.php";

// Support both JSON body and form-urlencoded
$input = file_get_contents('php://input');
$data = $_POST;
if ($input) {
    $json = json_decode($input, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
        $data = array_merge($data, $json);
    }
}

$id = intval($data['id'] ?? 0);
if ($id <= 0) {
    echo json_encode(['success' => false, 'error' => 'Missing id']);
    exit;
}

// Restore admin_posts
$stmt = $conn->prepare("UPDATE admin_posts SET deleted = 0, updated_at = NOW() WHERE id = ?");
$stmt->bind_param("i", $id);
$ok1 = $stmt->execute();
$stmt->close();

echo json_encode(['success' => (bool)$ok1]);
$conn->close();
