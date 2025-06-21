const submitLoginbtn=document.querySelector(".btn");
submitLoginbtn.addEventListener('click',async()=>{
    let acc=document.getElementById("account").value;
    let pwd=document.getElementById("password").value;
    if(!acc || !pwd){
        alert("請輸入帳號密碼");
        return;
    }
    
    const result=await submitLogin(acc, pwd);
    if (result.status=="fail"){
        alert("登入失敗");
        return;
        
    }
    const username=result.data.username;
    const role=result.data.role;
    let content={
        "username":username,
        "role":role
    };

    localStorage.setItem("content",JSON.stringify(content));
    window.location.href='home.html';
})

async function submitLogin(acc,pwd) {
        try{
            const response=await fetch('/attendance_and_absence_system/login.php',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                account: acc,
                password: pwd
            })
            });
            if (!response.ok) {
                throw new Error('登入失敗，請檢查帳號或密碼');
            }
            const result=await response.json();
            return result;
        }catch(error){
            console.error('錯誤訊息：', error);
            alert(error.message);
            return { status: 'fail' };
        }
    }

const data =localStorage.getItem("content");
if (data) {
  console.log("localStorage content:", data);
} else {
  console.log("localStorage 沒有 content");
}
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



