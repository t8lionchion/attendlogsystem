const data = localStorage.getItem("content");
const result = JSON.parse(data);
let username = result.username;
let role = result.role;
console.log(username);
console.log(role);

let myChart = null;
let my2Chart = null;
let my3Chart = null;

function renderheader({ usname }) {
    return `
    <h1 class="display-4 fw-bold mb-0">${usname} 的出缺席記錄</h1>
    <p class="lead mt-2">每日出勤一目了然</p>
  `;
}
/* 一般使用者儀錶板 */
function rendernav() {
    return dashboard_tmpl;
}
/* 一般使用者出缺席卡片 */
function renderviewcard() {

    return `
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
function renderthreechart() {
    return `
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

/* 下拉式選單主體 */
function rendermenubody() {
    return `
        <div class="row mt-3 mb-3">
            <div class="dropdown d-flex justify-content-center">
                <button id="selectstudentbtn" class="btn btn-secondary dropdown-toggle" type="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    Ray
                </button>
                <ul id="dropdown-menu" class="dropdown-menu scrollable-menu">

                </ul>
            </div>
        </div>
    `;
}

/* 下拉式選單的模板 */
function renderdropdownMenu({ acc }) {
    return `
    <li><a class="dropdown-item" href="#">${acc}</a></li>
    `;
}

async function attendance_log(username) {
    try {
        const res = await fetch("attendance.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
            })
        })
        if (!res.ok) {
            throw new Error("找不到" + username + "的出席資料");
        }
        const attendance = await res.json();
        if (attendance["status"] == 'fail') {
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
        document.querySelector('[data-attend="ex6"]').innerText = attendData["出勤比率"] + "%";

    } catch (error) {
        console.error('載入資料失敗:', error);
    }
};
async function fetchDataWithAxiosAndCreateChart(username) {
    try {
        const res = await fetch("attendance.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
            })
        });
        if (!res.ok) {
            throw new Error("找不到" + username + "的出席資料");
        }
        const attendance = await res.json();
        if (attendance["status"] == 'fail') {
            throw new Error(`無此人`);
        }
        const attend2 = attendance["data"];

        const Absence = [];
        Absence.push(attend2["實際上課時數"]);
        Absence.push(attend2["缺席時數"]);

        const ex07 = document.getElementById("ex07");

        if (myChart !== null) {
            myChart.destroy();
        }

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

async function fetchDataAndCreateChart(username) {
    try {
        // 假設 data.json 檔案與你的 index.html 在同一層目錄
        const response = await fetch("attendance_log2.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
            })
        });

        if (!response.ok) { // 檢查響應是否成功 (例如 HTTP 狀態碼 200)
            throw new Error(`HTTP 錯誤! 狀態: ${response.status}`);
        }
        const rawData = await response.json(); // 將響應解析為 JSON 物件


        // 從獲取的資料中提取 Chart.js 所需的 labels 和 data
        const class_date = rawData.data.map(item => item.class_date);

        const attended_hours = rawData.data.map(item => item.attended_hours);

        const ex08 = document.getElementById("ex08");
        // 創建 Chart.js 圖表

        if (my2Chart !== null) {
            my2Chart.destroy();
        }

        my2Chart = new Chart(ex08, {
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
async function fetchDataAndCreateScatter(username) {
    try {
        const response = await fetch("attendclasstime.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
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
        const ex09 = document.getElementById("ex09");

        if (my3Chart !== null) {
            my3Chart.destroy();
        }

        my3Chart = new Chart(ex09, {
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

async function renderMenu() {
    try {
        const result = await fetch('selectallname.php');
        const data = await result.json();
        const dropdownmenu = document.getElementById("dropdown-menu");
        const selectstudentbtn = document.getElementById("selectstudentbtn");


        let totalHTML = '';
        for (let i = 0; i < data['data'].length; i++) {
            totalHTML += renderdropdownMenu({ acc: data['data'][i]['acc'] });
        }
        dropdownmenu.innerHTML = totalHTML;


        const dropdown_items = document.querySelectorAll(".dropdown-item");

        dropdown_items.forEach(item => {
            item.addEventListener('click', () => {
                selectstudentbtn.innerText = item.innerText;
                attendance_log(item.innerText);
                fetchDataWithAxiosAndCreateChart(item.innerText);
                fetchDataAndCreateChart(item.innerText);
                fetchDataAndCreateScatter(item.innerText);
            });
        });

    } catch (error) {
        console.log('資料讀取失敗', error);
    }
}
/* admin的儀表板 */
function adminrendernav() {
    return `<div class="container-fluid">
            <a class="navbar-brand" href="#">出缺席儀錶板</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll"
                aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarScroll">
                <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
                    <li class="nav-item">
                        <a href="home.html" id="viewRecord" class="btn btn-primary ">home</a>
                    </li>
    
                    <li class="nav-item">
                        <a href="dashboard.html" id="viewRecord" class="btn btn-dark ">出缺席紀錄</a>
                    </li>
                    <li class="nav-item">
                        <a href="Punch_record.html" id="Punch_record" class="btn btn-success ">打卡紀錄</a>
                    </li>
                    <li class="nav-item ">
                        <a href="add.html" id="Punch_record" class="btn btn-secondary ">管理使用者</a>
                    </li>
                    <li class="nav-item ">
                        <button id="logout" class="btn btn-danger " >登出</button>
                    </li>
                </ul>
                
            </div>
        </div>`;
}

switch (role) {
    case 'normal':
        const normalnavbar = document.getElementById("normalnavbar");
        normalnavbar.classList.add("bg-secondary", "navbar", "navbar-expand-lg");
        const normalnavbarinsert = rendernav();
        normalnavbar.insertAdjacentHTML('beforeend', normalnavbarinsert);


        const header = document.getElementById("header");
        header.classList.add("bg-secondary", "container-fluid", "py-5", "shadow", "text-center", "header");
        let usernamerender = renderheader({ usname: username });
        header.insertAdjacentHTML('beforeend', usernamerender);

        const viewabsentcard = document.getElementById("viewabsentcard");
        viewabsentcard.classList.add("row", "text-center", "mb-4", "mt-4");
        const viewabsentcardcontent = renderviewcard();
        viewabsentcard.insertAdjacentHTML('beforeend', viewabsentcardcontent);

        const viewchart = document.getElementById("viewchart");
        viewchart.classList.add("container-fluid");
        const viewchartcontent = renderthreechart();
        viewchart.insertAdjacentHTML("beforeend", viewchartcontent);

        attendance_log(username);

        fetchDataWithAxiosAndCreateChart(username);
        // 頁面載入時自動執行載入資料並創建圖表的函數
        fetchDataAndCreateChart(username);

        fetchDataAndCreateScatter(username);

        break;
    case 'manager':
        const managernavbar = document.getElementById("managernavbar");
        managernavbar.classList.add("bg-secondary", "navbar", "navbar-expand-lg");
        const managernavbarinsert = rendernav();
        managernavbar.insertAdjacentHTML('beforeend', managernavbarinsert);


        const managerheader = document.getElementById("header");
        managerheader.classList.add("bg-secondary", "container-fluid", "py-5", "shadow", "text-center", "header");
        let managerheaderrender = renderheader({ usname: username });
        managerheader.insertAdjacentHTML('beforeend', managerheaderrender);

        const managerviewabsentcard = document.getElementById("viewabsentcard");
        managerviewabsentcard.classList.add("row", "text-center", "mb-4", "mt-4");
        const managerviewabsentcardcontent = renderviewcard();
        managerviewabsentcard.insertAdjacentHTML('beforeend', managerviewabsentcardcontent);

        const managerviewchart = document.getElementById("viewchart");
        managerviewchart.classList.add("container-fluid");
        const managerviewchartcontent = renderthreechart();
        managerviewchart.insertAdjacentHTML("beforeend", managerviewchartcontent);

        const managermenu = document.getElementById('managermenu');

        let managermenucontent = rendermenubody();
        console.log(managermenucontent);
        managermenu.insertAdjacentHTML("beforeend", managermenucontent);

        attendance_log('Ray');

        fetchDataWithAxiosAndCreateChart('Ray');
        // 頁面載入時自動執行載入資料並創建圖表的函數
        fetchDataAndCreateChart('Ray');

        fetchDataAndCreateScatter('Ray');


        renderMenu();

        break;
    case 'system_administrator':
        const admininavbar = document.getElementById("managernavbar");
        admininavbar.classList.add("bg-secondary", "navbar", "navbar-expand-lg");
        const admininavbarinsert = adminrendernav();
        admininavbar.insertAdjacentHTML('beforeend', admininavbarinsert);


        const adminiheader = document.getElementById("header");
        adminiheader.classList.add("bg-secondary", "container-fluid", "py-5", "shadow", "text-center", "header");
        let adminiheaderrender = renderheader({ usname: username });
        adminiheader.insertAdjacentHTML('beforeend', adminiheaderrender);

        const adminiviewabsentcard = document.getElementById("viewabsentcard");
       adminiviewabsentcard.classList.add("row", "text-center", "mb-4", "mt-4");
        const adminiviewabsentcardcontent = renderviewcard();
        adminiviewabsentcard.insertAdjacentHTML('beforeend', adminiviewabsentcardcontent);

        const adminiviewchart = document.getElementById("viewchart");
        adminiviewchart.classList.add("container-fluid");
        const adminiviewchartcontent = renderthreechart();
        adminiviewchart.insertAdjacentHTML("beforeend", adminiviewchartcontent);

        const adminimenu = document.getElementById('managermenu');

        let adminimenucontent = rendermenubody();
        
        adminimenu.insertAdjacentHTML("beforeend", adminimenucontent);

        attendance_log('Ray');

        fetchDataWithAxiosAndCreateChart('Ray');
        // 頁面載入時自動執行載入資料並創建圖表的函數
        fetchDataAndCreateChart('Ray');

        fetchDataAndCreateScatter('Ray');

        renderMenu();
        break;
}
