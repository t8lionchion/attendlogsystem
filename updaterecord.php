<?php

require_once 'phpdatabaseconnect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['status' => 'fail', 'message' => '缺少使用者ID']);
    exit;
}
$id=$data['id'];
$name = $data['name'];
$date=$data['date'];

$time=$data['time'];

try {
    
    $stmt = $pdo->prepare("UPDATE punch_record set Name=?,Time=?,Date=? where id=?");
    $stmt->execute([$name, $time, $date ,$id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success', 'message' => '更改使用者打卡資料成功']);
    } else {
        echo json_encode(['status' => 'fail', 'message' => '找不到該使用者']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'fail', 'message' => '資料庫錯誤']);
}
