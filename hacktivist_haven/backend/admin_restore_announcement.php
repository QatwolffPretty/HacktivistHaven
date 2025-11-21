<?php
require_once "db_connect.php";

$id = $_POST['id'] ?? 0;

$sql = "UPDATE admin_posts SET deleted = 0 WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["success" => true]);
?>
