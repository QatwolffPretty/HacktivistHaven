<?php
require_once "db_connect.php";

header('Content-Type: application/json');

try {
    $result = $conn->query("SELECT * FROM admin_posts WHERE deleted = 1 ORDER BY updated_at DESC");
    $posts = [];

    while($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }

    echo json_encode($posts);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
