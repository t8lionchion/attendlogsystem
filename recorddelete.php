<?php

require_once 'phpdatabaseconnect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name'])) {
    echo json_encode(['status' => 'fail', 'message' => '沒有這個人']);
    exit;
}
$date=$data['date'];
$time=$data['time'];
$name = $data['name'];

try {
    if (empty($data['name']) || empty($data['date']) || empty($data['time'])) {
        echo json_encode(['status' => 'fail', 'message' => '請提供完整資料']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM punch_record WHERE Name = ? and Date=? and Time=?");
    $stmt->execute([$name,$date,$time]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success', 'message' => '刪除成功']);
    } else {
        echo json_encode(['status' => 'fail', 'message' => '找不到該使用者']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'fail', 'message' => '資料庫錯誤']);
}
