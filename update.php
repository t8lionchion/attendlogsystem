<?php

require_once 'phpdatabaseconnect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['status' => 'fail', 'message' => '缺少使用者ID']);
    exit;
}

$id = intval($data['id']);
$acc=$data['acc'];
$pwd=md5($data['pwd']);

$role=$data['role'];

try {
    
    $stmt = $pdo->prepare("UPDATE admin_users set acc=?,pwd=?,role=? where id=?");
    $stmt->execute([$acc, $pwd, $role, $id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success', 'message' => '更改使用者資料成功']);
    } else {
        echo json_encode(['status' => 'fail', 'message' => '找不到該使用者']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'fail', 'message' => '資料庫錯誤']);
}
