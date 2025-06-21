<?php

require_once 'phpdatabaseconnect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['status' => 'fail', 'message' => '缺少使用者ID']);
    exit;
}

$id = intval($data['id']);

try {
    
    $stmt = $pdo->prepare("DELETE FROM admin_users WHERE id = ?");
    $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success', 'message' => '刪除成功']);
    } else {
        echo json_encode(['status' => 'fail', 'message' => '找不到該使用者']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'fail', 'message' => '資料庫錯誤']);
}
