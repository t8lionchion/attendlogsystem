const data = localStorage.getItem("content");
const result = JSON.parse(data);
let username = result.username;
let role = result.role;
console.log(username);
console.log(role);
/* 一般使用者的打卡紀錄模板 */
function renderheader({ usname }) {
    return `
    <h1 class="display-4 fw-bold mb-0">${usname} 管理使用者</h1>
    <p class="lead mt-2">每日出勤一目了然</p>
  `;
}
/* 表格整體渲染 */
function RenderTable() {
    return `
    <div class="col-8">
        <table class="table">
            <button type="button" class="btn btn-success" id="addUserBtn">
                <i class="bi bi-person-plus"></i> 新增使用者
            </button>
            <thead>
                <tr>
                    <th scope="col">id</th>
                    <th scope="col">使用者</th>
                    <th scope="col">帳號</th>
                    <th scope="col">權限</th>
                    <th scope="col">管理</th>
                </tr>
            </thead>
            <tbody id="insertrecord">

            </tbody>
        </table>
    </div>
    `;
}

/* 表格的body渲染模板 */
function rendertbody({ id, user_name, acc, role }) {
    return `
                <tr>
                    <th scope="row">${id}</th>
                    <td>${user_name}</td>
                    <td data-acc="${acc}">${acc}</td>
                    <td data-role='${role}'>${role}</td>
                    <td>
                        <button type="button" class="btn btn-info btn-sm update-btn" data-uid="${id}">
                            <i class="bi bi-pencil"></i>更改
                        </button>
                        <button type="button" class="btn btn-danger btn-sm delete-btn" data-id="${id}">
                            <i class="bi bi-trash"></i> 刪除
                        </button>
                        
                    </td>
                </tr>
 
 `;
}

function renderadd() {
    return `
    <h2 class="mb-4">建立使用者</h2>
        <form id="createUserForm">
            <!-- 姓名 (帳號) -->
            <div class="mb-3">
                <label for="username" class="form-label">姓名 (帳號)</label>
                <input type="text" class="form-control" id="username" placeholder="請輸入姓名或帳號">
            </div>

            <!-- 密碼 -->
            <div class="mb-3">
                <label for="password" class="form-label">密碼</label>
                <input type="password" class="form-control" id="password" placeholder="請輸入密碼">
            </div>

    
            <!-- 身分別 -->
            <div class="mb-3">
                <label for="role" class="form-label">身分別</label>
                <select class="form-select" id="role">
                    <option selected disabled>請選擇身分別</option>
                    <option value="manager">管理者</option>
                    <option value="system_administrator">系統管理者</option>
                </select>
            </div>

            <!-- 送出按鈕 -->
            <button type="submit" class="btn btn-primary">建立使用者</button>
        </form>
    `;
}

function renderupdate({id,acc,role}) {
    return `
    <h2 class="mb-4">更新使用者</h2>
        <form id="createUserForm">
            <!-- id  -->
            <div class="mb-3">
                <label for="username" class="form-label">id </label>
                <input type="text" class="form-control" id="userid" placeholder="請輸入id" value="${id}" readonly>
            </div>
            <!-- 姓名 (帳號) -->
            <div class="mb-3">
                <label for="username" class="form-label">姓名 (帳號)</label>
                <input type="text" class="form-control" id="username" placeholder="請輸入姓名或帳號" value="${acc}">
            </div>

            <!-- 密碼 -->
            <div class="mb-3">
                <label for="password" class="form-label">密碼</label>
                <input type="password" class="form-control" id="password" placeholder="請輸入密碼" >
            </div>

    
            <!-- 身分別 -->
            <div class="mb-3">
                <label for="role" class="form-label"></label>
                <select class="form-select" id="role">
                    <option selected disabled>${role}</option>
                    <option value="manager">管理者</option>
                    <option value="system_administrator">系統管理者</option>
                </select>
            </div>

            <!-- 送出按鈕 -->
            <button type="submit"id="updatebtn" class="btn btn-primary">更新使用者</button>
            <button type="submit"id="giveup" class="btn btn-danger">捨棄</button>
        </form>
    `;
}

const adminheader = document.getElementById("header");
adminheader.classList.add("bg-secondary", "container-fluid", "py-5", "shadow", "text-center", "header");
let adminRender = renderheader({ usname: username });
adminheader.insertAdjacentHTML('beforeend', adminRender);

const viewuser = document.getElementById("viewuser");
viewuser.classList.add("d-flex", "justify-content-center");
const viewusercontent = RenderTable();
viewuser.insertAdjacentHTML("beforeend", viewusercontent);

async function viewalluser() {
    try {
        const result = await fetch('viewuser.php');
        const data = await result.json();
        let total = '';
        const insertrecord = document.getElementById("insertrecord");
        for (let i = 0; i < data['data'].length; i++) {
            total += rendertbody({
                id: data['data'][i]['id'],
                user_name: data['data'][i]['user_name'],
                acc: data['data'][i]['acc'], role: data['data'][i]['role']
            });
        }
        insertrecord.insertAdjacentHTML("beforeend", total);

    } catch (error) {
        console.log('資料沒有傳到');
    }


}
viewalluser();

const addUserBtn = document.getElementById('addUserBtn');

addUserBtn.addEventListener("click", () => {
    const viewuser = document.getElementById("viewuser");
    viewuser.innerHTML = '';
    addUserBtn.classList.add("d-none");

    const addviewcard = document.getElementById('addviewcard');
    addviewcard.innerHTML = renderadd();

    const form = document.getElementById('createUserForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // 阻止表單預設提交行為

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const role = document.getElementById('role').value;

        console.log('送出資料：', { username, password, role }); // 🔥 這行可以幫你立刻驗證

        if (!username || !password || !role) {
            alert('請完整填寫所有欄位');
            return;
        }

        try {
            const res = await fetch('createuser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    role: role
                })
            });

            if (!res.ok) {
                throw new Error('建立使用者失敗');
            }

            const result = await res.json();
            console.log('建立結果:', result);

            if (result.status === 'success') {
                alert('使用者建立成功！');
                addviewcard.innerHTML = '';
                const viewuser = document.getElementById("viewuser");
                viewuser.classList.add("d-flex", "justify-content-center");
                const viewusercontent = RenderTable();
                viewuser.insertAdjacentHTML("beforeend", viewusercontent);
                viewalluser();
                addUserBtn.classList.remove("d-none");

            } else {
                alert('建立失敗：' + result.message);
            }

        } catch (error) {
            console.error('建立失敗:', error);
            alert('建立失敗，請檢查網路或伺服器錯誤');
        }
    });


});


document.getElementById("insertrecord").addEventListener("click", async (e) => {
    e.preventDefault();
    if(e.target.closest(".update-btn")){
        const ubtn=e.target.closest(".update-btn");
        const tr = ubtn.closest("tr");
        const id=ubtn.dataset.uid;
        let acc = tr.querySelector('td[data-acc]').dataset.acc;
        let role = tr.querySelector('td[data-role]').dataset.role;
        const viewuser = document.getElementById("viewuser");
        viewuser.innerHTML = '';
        addUserBtn.classList.add("d-none");
        const updateviewcard=document.getElementById('addviewcard');
        updateviewcard.innerHTML=renderupdate({id,acc,role});
            /* 下面繼續 */
        
        const btn=document.getElementById("updatebtn");
        btn.addEventListener("click",async(e)=>{
            e.preventDefault();
            const pwd=document.getElementById("password").value.trim();
            acc = document.getElementById("username").value.trim();
            role = document.getElementById("role").value;
            
            if(!pwd){
                alert("密碼不可為空");
                return;
            }
            const response=await fetch("update.php",{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id,acc,pwd,role })
            });
            const result = await response.json();
            if (result.status === 'success') {
                alert('更新成功！');
                window.location.href='add.html';
            } else {
                alert('更新失敗：' + result.message);
                window.location.href='add.html';
            }
        })
        const giveupbtn=document.getElementById("giveup");
        giveupbtn.addEventListener("click",()=>{
            window.location.href='add.html';
        })
        

    }
    if (e.target.closest(".delete-btn")) {
        const btn = e.target.closest(".delete-btn");
        const id = btn.dataset.id;
        if (!confirm(`確定要刪除使用者 ID: ${id} 嗎？`)) return;

        try {
            const response = await fetch('delete_user.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const result = await response.json();

            if (result.status === 'success') {
                alert('刪除成功！');
                // 移除該列
                const tr = btn.closest('tr');
                if(tr) tr.remove();
            } else {
                alert('刪除失敗：' + result.message);
            }
        } catch (error) {
            alert('刪除時發生錯誤！');
            console.error(error);
        }
    }
});


