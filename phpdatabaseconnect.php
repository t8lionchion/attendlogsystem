<?php
    $host = 'fs101.coded2.fun';        // 資料庫主機名，XAMPP 預設為 localhost
    $dbName = 'AbsenceSystemTeam3';   // 你的資料庫名稱 (來自練習 1 的要求)
    $username = 'ted';         // 資料庫使用者名稱，XAMPP 預設為 root
    $password = 'Fs1011688';             // 資料庫密碼，XAMPP 預設為空
    $charset = 'utf8mb4';       // 字元集，建議使用 utf8mb4 支援更多字元，如 Emoji
    $dsn = "mysql:host={$host};dbname={$dbName};charset={$charset}";

    // PDO 連接選項
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // 錯誤模式：拋出異常 (建議，有利於開發時發現問題)
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,     // 預設抓取模式：關聯陣列 (以欄位名稱作為鍵)
        PDO::ATTR_EMULATE_PREPARES   => false,                 // 關閉模擬預處理 (PHP 8.3 預設為 false，提高安全性與效能)
    ];

    try {
        $pdo = new PDO($dsn, $username, $password, $options);
        
        
    } catch (PDOException $e) {
        echo json_encode([
        'status' => 'fail',
        'message' => '資料庫連線失敗',
        'error' => $e->getMessage()
    ]);
    
    }
?>