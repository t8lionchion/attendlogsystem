const data = localStorage.getItem("content");
const result = JSON.parse(data);
let username = result.username;
let role = result.role;
console.log(username);
console.log(role);

function renderheader({ usname }) {
  return `
    <h1 class="display-4 fw-bold mb-0">${usname} 的出缺席記錄</h1>
    <p class="lead mt-2">每日出勤一目了然</p>
  `;
} 
/* 一般使用者儀錶板 */
function rendernav(){
    return dashboard_tmpl;
}
/* 一般使用者出缺席卡片 */
function renderviewcard(){
    return`
    <div class="col-md-4 col-lg-2">
            <div class="card shadow rounded">
                <div class="card-body">
                    <h6 class="card-title text-muted ">總課程時數</h6>
                    <h3 data-attend="ex1" class="text-primary"></h3>
                </div>
            </div>
        </div>

        <div class="col-md-4 col-lg-2">
            <div class="card shadow rounded">
                <div class="card-body">
                    <h6 class="card-title text-muted ">實際上課</h6>
                    <h3 data-attend="ex2" class="text-success"></h3>
                </div>
            </div>
        </div>

        <div class="col-md-4 col-lg-2">
            <div class="card shadow rounded">
                <div class="card-body">
                    <h6 class="card-title text-muted ">缺席</h6>
                    <h3 data-attend="ex3" class="text-danger"></h3>
                </div>
            </div>
        </div>

        <div class="col-md-4 col-lg-2">
            <div class="card shadow rounded">
                <div class="card-body">
                    <h6 class="card-title text-muted ">遲到</h6>
                    <h3 data-attend="ex4" class="text-warning"></h3>
                </div>
            </div>
        </div>

        <div class="col-md-4 col-lg-2">
            <div class="card shadow rounded">
                <div class="card-body">
                    <h6 class="card-title text-muted">早退</h6>
                    <h3 data-attend="ex5" class="text-warning"></h3>
                </div>
            </div>
        </div>

        <div class="col-md-4 col-lg-2">
            <div class="card shadow rounded">
                <div class="card-body">
                    <h6 class="card-title text-muted ">出勤比率</h6>
                    <h3 data-attend="ex6" class="text-info"></h3>
                </div>
            </div>
        </div>
    `;
}
/* 一般使用者的3張圖表 */
function renderthreechart(){
    return`
    <div class="row d-flex justify-content-center">
            <div class="col-lg-4">
                <div class="card">
                    <h1 class="card-title text-center bg-primary">出席狀況圓餅圖</h1>
                    <div class="card-body d-flex justify-content-center">
                        <canvas id="ex07"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 ">
                <div class="card ">
                    <h1 class="card-title text-center bg-secondary">每日上課時數折線圖</h1>
                    <div class="card-body d-flex justify-content-center">
                        <canvas id="ex08"></canvas>
                    </div>
                </div>
                <div class="card mt-4">
                    <h1 class="card-title text-center bg-info">每日在校時數長條圖</h1>
                    <div class="card-body d-flex justify-content-center">
                        <canvas id="ex09"></canvas>
                    </div>
                </div>
            </div>

        </div>
    `;
}

switch (role) {
  case 'normal':
    const normalnavbar=document.getElementById("normalnavbar");
    normalnavbar.classList.add("bg-secondary" ,"navbar" ,"navbar-expand-lg");
    const normalnavbarinsert=rendernav({usname: username});
    normalnavbar.insertAdjacentHTML('beforeend',normalnavbarinsert);

    
    const header = document.getElementById("header");
    header.classList.add("bg-secondary","container-fluid" , "py-5" ,"shadow"  ,"text-center","header");
    let usernamerender = renderheader({ usname: username });
    header.insertAdjacentHTML('beforeend', usernamerender);
    
    const viewabsentcard=document.getElementById("viewabsentcard");
    viewabsentcard.classList.add("row", "text-center", "mb-4",  "mt-4");
    const viewabsentcardcontent=renderviewcard();
    viewabsentcard.insertAdjacentHTML('beforeend',viewabsentcardcontent);

    const viewchart=document.getElementById("viewchart");
    viewchart.classList.add("container-fluid");
    const viewchartcontent=renderthreechart();
    viewchart.insertAdjacentHTML("beforeend",viewchartcontent);

    async function attendance_log(username) {
        try {
            const res = await fetch("/attendance_and_absence_system/attendance.php",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                username:username,
                })
            })
            if (!res.ok ) {
                throw new Error("找不到"+username+"的出席資料");
            }
            const attendance = await res.json();
            if(attendance["status"]=='fail'){
                throw new Error(`無此人`);
            }
            const attendData = attendance["data"];

            if (!attendData || attendData.length === 0) {
                throw new Error(`${username} 沒有出席資料`);
            }

            
                document.querySelector('[data-attend="ex1"]').innerText = attendData["總課程時數"] + "小時";
                document.querySelector('[data-attend="ex2"]').innerText = attendData["實際上課時數"] + "小時";
                document.querySelector('[data-attend="ex3"]').innerText = attendData["缺席時數"] + "小時";
                document.querySelector('[data-attend="ex4"]').innerText = attendData["遲到時間"] + "小時";
                document.querySelector('[data-attend="ex5"]').innerText = attendData["早退時數"] + "小時";
                document.querySelector('[data-attend="ex6"]').innerText = attendData["出勤比率"] +"%" ;
        
        } catch (error) {
            console.error('載入資料失敗:', error);
        }
    };
    attendance_log(username);
    const ex07 = document.getElementById("ex07");
    async function fetchDataWithAxiosAndCreateChart(username) {
        try {
            const res = await fetch("/attendance_and_absence_system/attendance.php",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                username:username,
                })
            });
            if (!res.ok ) {
                throw new Error("找不到"+username+"的出席資料");
            }
            const attendance = await res.json();
            if(attendance["status"]=='fail'){
                throw new Error(`無此人`);
            }
            const attend2 = attendance["data"];

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
    fetchDataWithAxiosAndCreateChart(username);
    const ex08 = document.getElementById("ex08");
    async function fetchDataAndCreateChart(username) {
        try {
            // 假設 data.json 檔案與你的 index.html 在同一層目錄
            const response = await fetch("/attendance_and_absence_system/attendance_log2.php",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                username:username,
                })
            });

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
    fetchDataAndCreateChart(username);

    const ex09 = document.getElementById("ex09");
    async function fetchDataAndCreateScatter(username) {
        try {
            const response = await fetch("/attendance_and_absence_system/attendclasstime.php",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                username:username,
                })
            });
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

    fetchDataAndCreateScatter(username);
    

    break;
  case 'manager':
    // 這邊可自行處理
    break;
  case 'administrator':
    // 這邊可自行處理
    break;
}
