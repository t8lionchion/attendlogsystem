const data = localStorage.getItem("content");
const result = JSON.parse(data);
let username = result.username;
let role = result.role;
console.log(username);
console.log(role);

/* 一般使用者的打卡紀錄模板 */
function renderheader({ usname }) {
    return `
    <h1 class="display-4 fw-bold mb-0">${usname} 的打卡記錄</h1>
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
/* 日期搜尋功能渲染 */
function RenderSearchDate() {
    return `<div class="row align-items-end g-3">
            <!-- 開始日期 -->
            <div class="col-md-4">
                <label for="startDate" class="form-label">開始日期</label>
                <input type="date" class="form-control" id="startDate">
            </div>
            <!-- 結束日期 -->
            <div class="col-md-4">
                <label for="endDate" class="form-label">結束日期</label>
                <input type="date" class="form-control" id="endDate">
            </div>
            <!-- 查詢按鈕 -->
            <div class="col-md-4 d-grid">
                <button id="searchButton" class="btn btn-primary">查詢</button>
            </div>
        </div>`;
}
/* 表格整體渲染 */
function RenderTable() {
    return `
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">name</th>
                    <th scope="col">in/out</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">IPAddress</th>
                </tr>
            </thead>
            <tbody id="insertrecord">

            </tbody>
        </table>
    `;
}

/* 表格的body渲染模板 */
function rendertbody({ Name, InOrOut, Date, Time, IPAddress }) {
    return `
                <tr>
                    <th scope="row">${Name}</th>
                    <td>${InOrOut}</td>
                    <td>${Date}</td>
                    <td>${Time}</td>
                    <td>${IPAddress}</td>
                </tr>
 
 `;
}

/* 下拉式選單的模板 */
function renderdropdownMenu({ acc }) {
    return `
    <li><a class="dropdown-item" href="#">${acc}</a></li>
    `;
}

/*管理者的日期搜尋功能模板 */
function rendermanagerdate() {
    return `
        <div class="row mt-3 mb-3">
            <div class="dropdown d-flex justify-content-center">
                <button id="selectstudentbtn" class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    請選取學生
                </button>
                <ul id="dropdown-menu" class="dropdown-menu scrollable-menu">
                    
                </ul>
            </div>
        </div>
        <div class="row align-items-end g-3">
            <!-- 開始日期 -->
            <div class="col-md-4">
                <label for="startDate" class="form-label">開始日期</label>
                <input type="date" class="form-control" id="startDate">
            </div>
            <!-- 結束日期 -->
            <div class="col-md-4">
                <label for="endDate" class="form-label">結束日期</label>
                <input type="date" class="form-control" id="endDate">
            </div>
            <!-- 查詢按鈕 -->
            <div class="col-md-4 d-grid">
                <button id="searchButton" class="btn btn-primary">查詢</button>
            </div>
        </div>
    `;
}
/* 一般使用者的功能 */
async function RecordTableBodyAPI(username) {
            try {
                const res = await fetch('/attendance_and_absence_system/record.php', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username
                    })
                })
                if (!res.ok) {
                    throw new Error("找不到" + username + "的打卡資料");
                }
                const result = await res.json();
                const data = result["data"];
                console.log(data.length);
                const insertRecord = document.getElementById("insertrecord");
                let totaltbody = '';
                for (let i = 0; i < 10; i++) {
                    totaltbody += rendertbody(data[i]);
                }

                insertRecord.insertAdjacentHTML('beforeend', totaltbody);

                const searchbutton = document.getElementById("searchButton");
                searchbutton.addEventListener("click", () => {
                    const startDate = document.getElementById("startDate").value;
                    const endDate = document.getElementById("endDate").value;
                    if (!startDate || !endDate) {
                        alert("日期不可以輸入空值");
                        return;
                    }
                    if (startDate > endDate) {
                        alert("開始日期不可以大於結束日期");
                        return;
                    }
                    insertRecord.innerHTML = '';
                    let totaltbody = '';
                    const filterdate = data.filter(item => item.Date > startDate && item.Date < endDate);
                    if (filterdate == 0) {
                        alert("查無資料");
                        return;
                    }
                    filterdate.forEach(item => {
                        totaltbody += rendertbody(item);
                    });
                    insertRecord.insertAdjacentHTML('beforeend', totaltbody);
                })



            } catch (error) {
                console.error('載入資料失敗:', error);
            }

        };
    
/* 企業管理者的功能 */    
// 全域變數，記錄目前選取的學生資料
let currentData = [];
let currentStudent = '';

// 取得學生資料的 API（只負責抓資料）
async function managerRecordTableBodyAPI(username) {
    try {
        const res = await fetch('/attendance_and_absence_system/record.php', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        });

        if (!res.ok) {
            throw new Error("找不到 " + username + " 的打卡資料");
        }

        const result = await res.json();
        const data = result["data"];
        console.log(data.length);
        return data;

    } catch (error) {
        console.error('載入資料失敗:', error);
        return []; // 錯誤時回傳空陣列，避免當掉
    }
}

// 渲染打卡表格（每次清空）
function renderTable(data) {
    const insertRecord = document.getElementById("insertrecord");
    insertRecord.innerHTML = ''; // 每次渲染前清空

    let totaltbody = '';
    for (let i = 0; i < Math.min(10, data.length); i++) {
        totaltbody += rendertbody(data[i]);
    }
    insertRecord.insertAdjacentHTML('beforeend', totaltbody);
}

// 渲染選單並綁定事件
async function renderMenu() {
    try {
        const result = await fetch('/attendance_and_absence_system/selectallname.php');
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
            item.addEventListener('click', async () => {
                selectstudentbtn.innerText = item.innerText;

                // 🔥 更新目前選取的學生
                currentStudent = item.innerText;

                // 🔥 取得該學生的打卡資料並渲染
                currentData = await managerRecordTableBodyAPI(currentStudent);
                renderTable(currentData);
            });
        });

        // 🔥 搜尋功能：只綁一次就好
        const searchbutton = document.getElementById("searchButton");
        searchbutton.addEventListener("click", () => {
            if (currentData.length === 0) {
                alert("請先選取學生");
                return;
            }

            const startDate = document.getElementById("startDate").value;
            const endDate = document.getElementById("endDate").value;

            if (!startDate || !endDate) {
                alert("日期不可以輸入空值");
                return;
            }
            if (startDate > endDate) {
                alert("開始日期不可以大於結束日期");
                return;
            }

            const filterData = currentData.filter(item => item.Date >= startDate && item.Date <= endDate);

            if (filterData.length === 0) {
                alert("查無資料");
                return;
            }

            renderTable(filterData); // 🔥 顯示篩選結果
        });

    } catch (error) {
        console.log('資料讀取失敗', error);
    }
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

        const SearchDate = document.getElementById("SearchDate");
        SearchDate.classList.add("container", "mt-4");
        let SearchDateContent = RenderSearchDate();
        SearchDate.insertAdjacentHTML("beforeend", SearchDateContent);

        const recordtable = document.getElementById("recordtable");
        recordtable.classList.add("container-fluid", "mt-4");
        let recordtableContent = RenderTable();
        recordtable.insertAdjacentHTML("beforeend", recordtableContent);
        

        RecordTableBodyAPI(username);

        break;
    case 'manager':
        const managernavbar = document.getElementById("normalnavbar");
        managernavbar.classList.add("bg-secondary", "navbar", "navbar-expand-lg");
        const managernavbarinsert = rendernav();
        managernavbar.insertAdjacentHTML('beforeend', managernavbarinsert);


        const managerheader = document.getElementById("header");
        managerheader.classList.add("bg-secondary", "container-fluid", "py-5", "shadow", "text-center", "header");
        let managerrender = renderheader({ usname: username });
        managerheader.insertAdjacentHTML('beforeend', managerrender);

        const managerSearchdate=document.getElementById("managerSearchDate");
        console.log(managerSearchdate);
        let managerSearchdatecontent=rendermanagerdate();
        console.log(managerSearchdatecontent);
        managerSearchdate.insertAdjacentHTML('beforeend',managerSearchdatecontent);

        const managerrecordtable = document.getElementById("recordtable");
        managerrecordtable.classList.add("container-fluid", "mt-4");
        let managerrecordtableContent = RenderTable();
        managerrecordtable.insertAdjacentHTML("beforeend", managerrecordtableContent);
        
        renderMenu();

        
        

        break;
    case 'administrator':
        // 這邊可自行處理
        break;
}