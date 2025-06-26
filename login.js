async function submitLogin(acc, pwd) {
    try {
        const response = await fetch('login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account: acc, password: pwd })
        });

        const result = await response.json();
        return result;

    } catch (error) {
        console.error(error);
        return { status: 'fail' };
    }
}

/* (async () => {
    const result = await submitLogin('Ted', 'fs101');
    console.log(result);
})(); */

const submitLoginbtn = document.getElementById('loginsubmitbtn');

submitLoginbtn.addEventListener('click', async (e) => {
    e.preventDefault(); 
    try {
        const acc = document.getElementById("account").value;
        const pwd = document.getElementById("password").value;

        if (!acc || !pwd) {
            alert("請輸入帳號密碼");
            return;
        }

        submitLoginbtn.disabled = true;
        const result = await submitLogin(acc, pwd);
        console.log(result);
        submitLoginbtn.disabled = false;
        if (result.status == "fail") {

            return;

        }
        const username = result.data.username;
        const role = result.data.role;
        let content = {
            "username": username,
            "role": role
        };
        console.log(content);
        localStorage.setItem("content", JSON.stringify(content));
        alert('登入成功，準備跳轉');
        window.location.href = 'home.html';
    } catch (error) {
        console.log("錯誤" + error);
    }

})


/* const data = localStorage.getItem("content");
if (data) {
    console.log("localStorage content:", data);
} else {
    console.log("localStorage 沒有 content");
} */
/* 
回傳
{
  "status": "success",
  "data": 
    { "username": "Ted", "role": "normal" } 
}
或是
{
  "status": "fail",
  "message": "查無資料"
}
 */



