<?php
require_once 'phpdatabaseconnect.php';
header('Content-type:application/json');
$rowdata = file_get_contents('php://input');
$data = json_decode($rowdata, true);
$name=$data['username'] ?? '';
$sql='SELECT id, Name, InOrOut, Date, Time, IPAddress
FROM punch_record
WHERE Name = ?
ORDER BY Date DESC, Time DESC';
$stmt=$pdo->prepare($sql);
$stmt->execute([$name]);
$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode([
    'data'=>$result
]);
?>