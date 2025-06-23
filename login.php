<?php
require_once 'phpdatabaseconnect.php';

header('Content-type:application/json');
$rowdata = file_get_contents('php://input');
$data = json_decode($rowdata, true);
// 取出帳號密碼

$account = $data['account'] ?? '';
$password = $data['password'] ?? '';

if (!$account || !$password) {
    echo json_encode(['status' => 'fail', 'message' => '帳號或密碼不可為空']);
    exit;
}
$stmt = $pdo->prepare('select user_name,role,pwd from admin_users where acc=?');
$stmt->execute([$account]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$result) {
    echo json_encode(['status' => 'fail', 'message' => '查無資料']);
    exit;
}

// 密碼驗證
if (md5($password) === $result['pwd']) {
    echo json_encode([
        'status' => 'success',
        'data' => [
            'username' => $result['user_name'],
            'role' => $result['role']   
        ]
    ]);
} else {
    echo json_encode(['status' => 'fail', 'message' => '密碼錯誤']);
    exit;
}
