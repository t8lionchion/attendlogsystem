const data = localStorage.getItem("content");
const result = JSON.parse(data);
let username = result.username;
let role = result.role;
console.log(username);
console.log(role);

/* 一般使用者的打卡紀錄模板 */
function renderheader({ usname }) {
    return `
    <h1 class="display-4 fw-bold mb-0">${usname} 的首頁</h1>
    <p class="lead mt-2">每日出勤一目了然</p>
  `;
}

/* 一般使用者儀錶板 */
function rendernav() {
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
                        <button id="logout" class="btn btn-danger " >登出</button>
                    </li>
                </ul>
                
            </div>
        </div>`;
}
/* 一般使用者的home卡片 */
function renderhomecards(){
    return`
    <div class="container-fluid">
            <div class="row">
                <div class="col-md-4 col-lg-3 mt-3">
                    <div class="card shadow rounded">
                        <div class="card-body">
                            <h6 class="card-title text-muted ">總課程時數</h6>
                            <h3 data-attend="1" class="text-primary"></h3>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 col-lg-3 mt-3">
                    <div class="card shadow rounded">
                        <div class="card-body">
                            <h6 class="card-title text-muted ">總課程數</h6>
                            <h3 data-attend="2" class="text-success"></h3>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 col-lg-3 mt-3">
                    <div class="card shadow rounded">
                        <div class="card-body">
                            <h6 class="card-title text-muted ">課程總天數</h6>
                            <h3 data-attend="3" class="text-danger"></h3>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 col-lg-3 mt-3">
                    <div class="card shadow rounded">
                        <div class="card-body">
                            <h6 class="card-title text-muted ">總出席率</h6>
                            <h3 data-attend="4" class="text-warning"></h3>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 col-lg-3 mt-3">
                    <div class="card shadow rounded">
                        <div class="card-body">
                            <h6 class="card-title text-muted">總遲到率</h6>
                            <h3 data-attend="5" class="text-warning"></h3>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 col-lg-3 mt-3">
                    <div class="card shadow rounded">
                        <div class="card-body">
                            <h6 class="card-title text-muted ">總早退率</h6>
                            <h3 data-attend="6" class="text-info"></h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 col-lg-3 mt-3">
                    <div class="card shadow rounded">
                        <div class="card-body">
                            <h6 class="card-title text-muted ">平均到校時數</h6>
                            <h3 data-attend="7" class="text-primary"></h3>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-4 d-flex justify-content-center">
                <div class="col-9">
                    <div class="card shadow rounded">
                        <h3 class="card-title text-center">全課程完成率</h3>
                        <div class="card-body">
                            <canvas id="HomeChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
    `;
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

        const main=document.getElementById("main");
        let rendermaincontent=renderhomecards();
        main.insertAdjacentHTML('beforeend',rendermaincontent);

        async function home_log(username) {
            try {
                const res = await fetch("/attendance_and_absence_system/home.php", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                    })
                })
                if (!res.ok) {
                    throw new Error("找不到" + username + "的課程資料");
                }
                const attendance = await res.json();
                if (attendance["status"] == 'fail') {
                    throw new Error(`無此人`);
                }
                const attendData = attendance["data"];
                console.log(attendData);
                if (!attendData || attendData.length === 0) {
                    throw new Error(`${username} 沒有資料`);
                }


                document.querySelector('[data-attend="1"]').innerText = attendData[0]["總課程時數"] + "小時";
                document.querySelector('[data-attend="2"]').innerText = attendData[0]["總課程數"] + "個";
                document.querySelector('[data-attend="3"]').innerText = attendData[0]["總天數"] + "天";
                document.querySelector('[data-attend="4"]').innerText = (attendData[0]["總出席率"] * 100).toFixed(2) + "%";
                document.querySelector('[data-attend="5"]').innerText = (attendData[0]["總遲到率"] * 100).toFixed(2) + "%";
                document.querySelector('[data-attend="6"]').innerText = (attendData[0]["總早退率"] * 100).toFixed(2) + "%";
                document.querySelector('[data-attend="7"]').innerText = (attendData[0]["平均到校時數"]).toFixed(2) + "小時";
            } catch (error) {
                console.error('載入資料失敗:', error);
            }
        };
        home_log(username);

        const HomeChart = document.getElementById("HomeChart");
        async function renderhomechartdata(username) {
            try {
                const response = await fetch("/attendance_and_absence_system/homechart.php", {
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

                const labels = rawData.data.map(item => item['課程名稱']);
                const dataSet = rawData.data.map(item =>
                    parseFloat(item['出席率百分比'],));
                const totalhours = rawData.data.map(item => item['課程總時數']);
                const attendhours = rawData.data.map(item => item['出席時數']);

                const barChart = new Chart(HomeChart, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: '課程出席率',
                            data: dataSet,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)'
                        }]
                    },
                    options: {
                        scales: {

                            y: {
                                beginAtZero: true,
                                title: { display: true, text: '課程完成率(%)' }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const i = context.dataIndex;
                                        return [
                                            `課程名稱: ${labels[i]}`,
                                            `出席率: ${dataSet[i]}%`,
                                            `總時數: ${totalhours[i]} 小時`,
                                            `出席時數: ${attendhours[i]} 小時`
                                        ];
                                    }
                                }
                            }
                        }

                    }
                });

            } catch (error) {
                console.error('載入資料失敗:', error);
                alert('無法載入圖表資料，請檢查網路或檔案路徑！');
            }
        }

        renderhomechartdata(username);
        break;
    case 'manager':
        // 這邊可自行處理
        break;
    case 'administrator':
        // 這邊可自行處理
        break;
}