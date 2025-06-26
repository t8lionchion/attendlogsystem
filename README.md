
# 出缺席系統（Attendance and Absence System）

## 📌 專案簡介

出缺席系統用於記錄使用者的出缺勤狀態，並提供帳號登入、打卡紀錄查詢、出缺席圖表查詢等功能，目標為建立一套簡易且可擴充的考勤管理平台。

---

## 🛠️ 專案功能

### 分為三種權限角色

| 功能           | 說明                                           |
| ------------ | -------------------------------------------- |
| 一般使用者登入      | 透過帳號密碼驗證登入系統                                 |
| 一般使用者首頁可查詢資訊 | 查看總課程時數、總課程數、總天數、總出席率、總遲到率、總早退率、平均到校時數，並顯示圖表 |
| 一般使用者出缺席紀錄查詢 | 查詢個人出席狀況圓餅圖、每日上課時數折線圖、每日在校時數長條圖，以及六張出缺席資訊卡片  |
| 一般使用者打卡紀錄查詢  | 查詢個人打卡紀錄，也能查詢特定日期範圍內的打卡紀錄                                  |
| 企業管理員（公司管理員） | 查看所有使用者的出缺席資訊、打卡資訊及相關圖表                      |
| 系統管理員（系統管理者） | 管理員可新增、刪除使用者帳號、設定密碼、分配權限，並可查詢所有使用者資料         |

---

## 🗄️ 資料表設計

### admin\_users（使用者資料）

| 欄位         | 型態                                                 | 說明         |
| ---------- | -------------------------------------------------- | ---------- |
| id         | INT                                                | 使用者 ID（主鍵） |
| acc        | VARCHAR                                            | 帳號         |
| pwd        | VARCHAR                                            | 密碼（加密儲存）   |
| role       | ENUM('normal', 'manager', 'system\_administrator') | 使用者權限      |
| user\_name | VARCHAR                                            | 使用者姓名      |

---

### punch\_record（打卡紀錄）

| 欄位          | 型態                | 說明         |
| ----------- | ----------------- | ---------- |
| id          | INT               | 紀錄 ID（主鍵）  |
| group\_name | VARCHAR           | 使用者班級      |
| name        | VARCHAR           | 使用者姓名      |
| InOrOut     | ENUM('in', 'out') | 出席狀態       |
| time        | TIME              | 打卡時間       |
| date        | DATE              | 打卡日期       |
| IPAddress   | VARCHAR           | 登入時的 IP 位置 |

---

### attendance\_log（出勤統計資料）

| 欄位名稱                | 資料型別    | 說明                |
| ------------------- | ------- | ----------------- |
| name                | VARCHAR | 姓名                |
| class\_date         | DATE    | 上課日期              |
| class\_hours        | FLOAT   | 課程時數              |
| raw\_hours          | FLOAT   | 到校時間至離校時間（含午休）    |
| attended\_hours     | FLOAT   | 實際上課時數（扣除午休）      |
| late\_hours         | FLOAT   | 遲到時間（1 小時內標記遲到）   |
| leave\_early\_hours | FLOAT   | 早退時間（1 小時內標記早退）   |
| absent\_hours       | FLOAT   | 缺席時數（課程時數 - 上課時數） |

---

### classes（課程資訊）

| 欄位名稱         | 資料型別    | 說明   |
| ------------ | ------- | ---- |
| id           | INT     | 主鍵   |
| group\_name  | VARCHAR | 班級代號 |
| class\_date  | DATE    | 上課日期 |
| class\_hours | INT     | 課程時數 |
| class\_name  | VARCHAR | 課程名稱 |

---

## 📂 資料庫連接 PHP

| 資料庫連結檔案                | 說明            |
| ---------------------- | ------------- |
| phpdatabaseconnect.php | 連結資料庫的 PHP 檔案 |

---

## 🌐 API 設計

| API                  | 方法   | 說明                |
| -------------------- | ---- | ----------------- |
| login.php            | POST | 使用者登入，回傳帳號與權限資訊   |
| homechart.php        | POST | 首頁全課程完成率圖表        |
| home.php             | POST | 首頁使用者出缺席統計資訊      |
| selectallname.php    | POST | 下拉式選單的學生總數        |
| attendance.php       | POST | 出席狀況圓餅圖           |
| attendance\_log2.php | POST | 每日上課時數折線圖與出缺席資訊卡片 |
| attendclasstime.php  | POST | 每日在校時數長條圖         |
| record.php           | POST | 學生打卡紀錄            |
| viewuser.php         | GET  | 系統管理者查看所有使用者      |
| delete\_user.php     | POST | 刪除使用者             |
| createuser.php       | POST | 新增使用者             |

---

## 🔄 前後端流程

| 步驟 | 說明                            |
| -- | ----------------------------- |
| 1  | 使用者輸入帳號密碼，送出登入請求              |
| 2  | 後端驗證帳密，回傳登入結果及權限資訊            |
| 3  | 登入成功後，前端儲存 localStorage，導向主畫面 |
| 4  | 使用者可進行出缺席圖表及打卡資料查詢            |
| 5  | 後端提供出缺席與打卡資料，回傳顯示結果           |
| 6  | 企業管理員可查看所有使用者出缺席及打卡資訊         |
| 7  | 系統管理員可管理所有使用者帳號及權限設定          |
| 8  | 所有資料皆透過 API 查詢並顯示在前端表格與圖表     |

---

## 📚 技術架構

* 前端：HTML + CSS + JavaScript（Fetch API）
* 後端：PHP + MySQL（XAMPP）
* 資料交換格式：JSON
* 開發環境：localhost:8080
* 上架環境：[http://absencedashboard.zapto.org/](http://absencedashboard.zapto.org/)

---

## 🔒 資安注意事項

* 密碼需使用雜湊（建議使用 `password_hash`）
* 前後端需驗證資料格式，防止 SQL Injection
* 登入 API 回傳應避免包含敏感資訊（如：密碼）
* 建議 API 可加上 Token 或 Session 管理（進階）

---


