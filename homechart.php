<?php
require_once 'phpdatabaseconnect.php';
header('Content-type:application/json');
$rowdata = file_get_contents('php://input');
$data = json_decode($rowdata, true);
$name=$data['username'] ?? '';

$sql='SELECT 
    c.class_name AS 課程名稱,
    SUM(c.class_hours) AS 課程總時數,
    IFNULL(SUM(a.attended_hours), 0) AS 出席時數,
    ROUND(IFNULL(SUM(a.attended_hours), 0) / SUM(c.class_hours) * 100, 2) AS 出席率百分比
FROM classes AS c
LEFT JOIN attendance_log AS a
    ON c.class_date = a.class_date 
    AND a.name = ?
GROUP BY c.class_name;';
$stmt=$pdo->prepare($sql);
$stmt->execute([$name]);
$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode([
    'data'=>$result
]);

?>