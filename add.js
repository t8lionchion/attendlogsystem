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


const adminheader = document.getElementById("header");
adminheader.classList.add("bg-secondary", "container-fluid", "py-5", "shadow", "text-center", "header");
let adminRender = renderheader({ usname: username });
adminheader.insertAdjacentHTML('beforeend', adminRender);