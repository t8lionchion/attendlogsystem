<?php
require_once 'phpdatabaseconnect.php';
header('Content-type:application/json');
$rowdata = file_get_contents('php://input');
$data = json_decode($rowdata, true);
$name=$data['username'] ?? '';
$sql='SELECT
  SUM(class_hours) AS `總課程時數`,
  SUM(attended_hours) AS `實際上課時數`,
  SUM(absent_hours) AS `缺席時數`,
  SUM(late_hours) AS `遲到時間`,
  SUM(leave_early_hours) AS `早退時數`,
  SUM(attended_hours) / SUM(class_hours) AS `出勤比率`
FROM attendance_log
WHERE name = ?';
$stmt=$pdo->prepare($sql);
$stmt->execute([$name]);
$result=$stmt->fetch(PDO::FETCH_ASSOC);
if (!$result || $result['總課程時數'] === null) {
    echo json_encode(['status' => 'fail', 'message' => '查無資料']);
    exit;
}
echo json_encode([
                'status' => 'success',
                'data'=>[
                "總課程時數"=> number_format($result['總課程時數'],2),
                "實際上課時數"=> number_format($result['實際上課時數'],2),
                "缺席時數"=> number_format($result['缺席時數'],2),
                "遲到時間"=> number_format($result['遲到時間'],2),
                "早退時數"=> number_format($result['早退時數'],2),
                "出勤比率"=> number_format($result['出勤比率'],2)*100
                ]
])
?>