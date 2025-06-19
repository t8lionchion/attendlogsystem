const data = localStorage.getItem("content");
const result = JSON.parse(data);
let username = result.username;
let role = result.role;
console.log(username);
console.log(role);

function renderheader({ usname }) {
  return `
    <nav>
      <ul class="row">
        <li class="col-lg-2" style="list-style-type:none">
          <button id="logout" class="btn btn-danger">登出</button>
        </li>
      </ul>
    </nav>
    <h1 class="display-4 fw-bold mb-0">${usname} 的出缺席記錄</h1>
    <p class="lead mt-2">每日出勤一目了然</p>
  `;
}

switch (role) {
  case 'normal':
    let usernamerender = renderheader({ usname: username });
    const header = document.querySelector(".header");
    header.insertAdjacentHTML('beforeend', usernamerender);
    async function attendance_log() {
        try {
            const res = await fetch("attendance_log.json");
            if (!res) {
                throw new Error("找不到"+username+"的出席資料");
            }
            const attendance = await res.json();
            const attend = attendance["data"][0];
            document.querySelector('[data-attend="ex1"]').innerText = attend["總課程時數"] + "小時";
            document.querySelector('[data-attend="ex2"]').innerText = attend["實際上課時數"] + "小時";
            document.querySelector('[data-attend="ex3"]').innerText = attend["缺席時數"] + "小時";
            document.querySelector('[data-attend="ex4"]').innerText = attend["遲到時間"] + "小時";
            document.querySelector('[data-attend="ex5"]').innerText = attend["早退時數"] + "小時";
            document.querySelector('[data-attend="ex6"]').innerText = attend["出勤比率"]  ;

        } catch (error) {
            console.error('載入資料失敗:', error);
        }
    };
    attendance_log();
    const ex07 = document.getElementById("ex07");
    async function fetchDataWithAxiosAndCreateChart() {
        try {
            const res = await fetch("attendance_log.json");
            const attendance = await res.json();
            const attend2 = attendance["data"][0];

            const Absence = [];
            Absence.push(attend2["實際上課時數"]);
            Absence.push(attend2["缺席時數"]);


            myChart = new Chart(ex07, {
                type: 'pie',
                data: {
                    labels: ["出席", "缺席"],
                    datasets: [{
                        label: '出缺席',
                        data: Absence,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                        ],
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true
                }
            });
        } catch (error) {
            console.error('載入資料失敗:', error);
            alert('無法載入圖表資料，請檢查網路或檔案路徑！');
        }
    }
    fetchDataWithAxiosAndCreateChart();
    const ex08 = document.getElementById("ex08");
    async function fetchDataAndCreateChart() {
        try {
            // 假設 data.json 檔案與你的 index.html 在同一層目錄
            const response = await fetch("attendance_log2.json");

            if (!response.ok) { // 檢查響應是否成功 (例如 HTTP 狀態碼 200)
                throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
            }
            const rawData = await response.json(); // 將響應解析為 JSON 物件


            // 從獲取的資料中提取 Chart.js 所需的 labels 和 data
            const class_date = rawData.data.map(item => item.class_date);

            const attended_hours = rawData.data.map(item => item.attended_hours);


            // 創建 Chart.js 圖表
            myChart = new Chart(ex08, {
                type: 'line',
                data: {
                    labels: class_date,
                    datasets: [{
                        label: '每日上課時數',
                        data: attended_hours,
                        borderColor: 'rgba(54, 162, 235, 0.6)',
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        fill: true,
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: true
                }
            });
        } catch (error) {
            console.error('載入資料失敗:', error);
            // 可以在這裡顯示錯誤訊息給用戶
            alert('無法載入圖表資料，請檢查網路或檔案路徑！');
        }
    }

    // 頁面載入時自動執行載入資料並創建圖表的函數
    fetchDataAndCreateChart();

    const ex09 = document.getElementById("ex09");
    async function fetchDataAndCreateScatter() {
        try {
            const response = await fetch("attendclasstime.json");
            if (!response.ok) {
                throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
            }

            const rawData = await response.json();

            const barData = rawData.data.map(item => ({
                x: item.class_date,
                y: parseFloat(item.raw_hours)
            }));

            const barChart = new Chart(ex09, {
                type: 'bar',
                data: {
                    datasets: [{
                        label: '每日在校時數',
                        data: barData,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)'
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'category',
                            title: { display: true, text: '上課日期' }
                        },
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: '在校時數' }
                        }
                    },

                }
            });

        } catch (error) {
            console.error('載入資料失敗:', error);
            alert('無法載入圖表資料，請檢查網路或檔案路徑！');
        }
    }

    fetchDataAndCreateScatter();
    break;
  case 'manager':
    // 這邊可自行處理
    break;
  case 'administrator':
    // 這邊可自行處理
    break;
}
