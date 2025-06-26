<?php
require_once 'phpdatabaseconnect.php';
header('Content-type:application/json');
$data = json_decode(file_get_contents('php://input'), true);

// 防呆：確認資料存在與格式正確
if (!$data || !isset($data['id'])) {
    echo json_encode([
        'status' => 'fail',
        'message' => '請傳入正確的 JSON 格式與 id 欄位'
    ]);
    exit;
}

$id = intval($data['id']);
$sql = 'SELECT acc,pwd,role FROM `admin_users` WHERE id=?;';
$stmt = $pdo->prepare($sql);
$stmt->execute([$id]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);
if(!$result){
    echo json_encode([
        'status'=> 'fail',
        'message'=>'找不到該使用者id'
    ]);
    exit; 
}
// 回傳 JSON 格式
echo json_encode([
     'status'=> 'success',
    'data' => $result
]);
?>