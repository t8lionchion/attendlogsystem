<?php
require_once 'phpdatabaseconnect.php';
header('Content-type:application/json');

// 不需要任何參數，直接查詢全部 acc
$sql = 'SELECT id,user_name,acc,role FROM admin_users';
$stmt = $pdo->prepare($sql);
$stmt->execute();
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 回傳 JSON 格式
echo json_encode([
    'data' => $result
]);
?>