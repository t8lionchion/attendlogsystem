<?php
require_once 'phpdatabaseconnect.php';
header('Content-type:application/json');
$rowdata = file_get_contents('php://input');
$data = json_decode($rowdata, true);
$name=$data['username'] ?? '';
$sql='SELECT
    t1.總課程時數,
    t1.總課程數,
    t1.總天數,
    t2.name,
    t2.總出席率,
    t2.總遲到率,
    t2.總早退率,
    t2.平均到校時數
FROM
    (SELECT
        SUM(c.class_hours) AS 總課程時數,
        COUNT(DISTINCT c.class_name) AS 總課程數,
        COUNT(c.class_date) AS 總天數
     FROM classes AS c) AS t1

CROSS JOIN

    (SELECT
        name,
        SUM(a.attended_hours) / SUM(a.class_hours) AS 總出席率,
        SUM(a.late_hours) / SUM(a.class_hours) AS 總遲到率,
        SUM(a.leave_early_hours) / SUM(a.class_hours) AS 總早退率,
        SUM(a.raw_hours) / COUNT(a.raw_hours) AS 平均到校時數
     FROM attendance_log AS a
     WHERE name = ?
     GROUP BY name) AS t2;
';
$stmt=$pdo->prepare($sql);
$stmt->execute([$name]);
$result=$stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode([
    'data'=>$result
]);


?>