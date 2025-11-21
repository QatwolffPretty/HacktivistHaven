<?php
require_once "db_connect.php";

$sql = "SELECT id, title, createdAt 
        FROM admin_posts 
        WHERE pinned = 1 AND deleted = 0
        ORDER BY createdAt DESC LIMIT 3";

$result = $conn->query($sql);
$posts = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($posts);
?>
