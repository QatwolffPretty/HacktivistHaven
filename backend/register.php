<?php
session_start();
require_once __DIR__ . '/db_connect.php';

$role = $_POST['role'];
$fullname = $_POST['fullname'];
$username = $_POST['username'];
$email = $_POST['email'];
$country = $_POST['country'];
$telegram = $_POST['telegram'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$table = ($role === "admin") ? "admins" : "students";

$sql = "INSERT INTO $table 
(fullname, username, email, password, country, telegram)
VALUES ('$fullname', '$username', '$email', '$password', '$country', '$telegram')";

if (mysqli_query($conn, $sql)) {
    if($role === "admin") {
        header("Location: signin.html?success=admin_registered");
    }else{
        header("Location: signin.html?success=student_registered");
    }
    exit();
} else {
    echo "Registration failed: " . mysqli_error($conn);
}
?>
