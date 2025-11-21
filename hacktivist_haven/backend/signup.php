<?php
require_once __DIR__ . '/db_connect.php';
session_start();

if($_SERVER["REQUEST_METHOD"] == "POST"){
    
    $fullname = trim($_POST['fullname']);
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $country = $_POST['country'];
    $telegram = $_POST['telegram'] ?? '';

    $sql = "INSERT INTO hh_users (fullname, username, email, telegram, country, password, role)
            VALUES (?, ?, ?, ?, ?, ?, 'student')";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss", 
        $fullname, $username, $email, $telegram, $country, $password);

    if($stmt->execute()){
        $_SESSION['user_id'] = $conn->insert_id;
        $_SESSION['username'] = $username;
        $_SESSION['fullname'] = $fullname;
        $_SESSION['role'] = "student";

        header("Location: ../student-dashboard.php");
        exit;
    } else {
        echo "<script>alert('Username or email already exists!'); window.location='../signup.html';</script>";
    }
}
?>
