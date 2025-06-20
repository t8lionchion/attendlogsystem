<?php
require_once 'phpdatabaseconnect.php';
header('Content-type:application/json');
$rowdata = file_get_contents('php://input');
$data = json_decode($rowdata, true);
$name=$data['username'] ?? '';
$sql='SELECT class_date, attended_hours
FROM attendance_log
WHERE name = ?';
$stmt=$pdo->prepare($sql);
$stmt->execute([$name]);
$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode([
    'data'=>$result
]);
?>