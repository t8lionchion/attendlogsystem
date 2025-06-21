<?php
require_once 'phpdatabaseconnect.php';
header('Content-Type: application/json');

// 顯示所有錯誤（開發用）
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 取得前端 JSON
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if ($data === null) {
    echo json_encode([
        'status' => 'fail',
        'message' => 'JSON 解析失敗',
        'raw_input' => $rawInput,
        'json_error' => json_last_error_msg()
    ]);
    exit;
}

// 取得欄位並 trim
$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');
$role = trim($data['role'] ?? '');

// 角色映射白名單
$roleMap = [
    '管理者' => 'manager',
    '系統管理員' => 'system_administrator',
    'manager' => 'manager',
    'system_administrator' => 'system_administrator'
];

if (!isset($roleMap[$role])) {
    echo json_encode(['status' => 'fail', 'message' => '身分別錯誤']);
    exit;
}

$role = $roleMap[$role];

// 基本欄位檢查
if (empty($username) || empty($password) || empty($role)) {
    echo json_encode(['status' => 'fail', 'message' => '欄位不可為空']);
    exit;
}

try {
    // 檢查帳號是否已存在
    $checkSql = "SELECT 1 FROM admin_users WHERE acc = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$username]);
    if ($checkStmt->fetch()) {
        echo json_encode(['status' => 'fail', 'message' => '帳號已存在']);
        exit;
    }

    $hashedPassword = md5($password);

    $insertSql = "INSERT INTO admin_users (acc, pwd, role, user_name) VALUES (?, ?, ?, ?)";
    $insertStmt = $pdo->prepare($insertSql);
    $insertStmt->execute([$username, $hashedPassword, $role, $username]);


    echo json_encode(['status' => 'success', 'message' => '使用者新增成功']);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'fail',
        'message' => '資料庫錯誤，新增失敗',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'fail',
        'message' => '伺服器錯誤',
        'error' => $e->getMessage()
    ]);
}
