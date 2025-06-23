const logoutbtn=document.getElementById("logout");
logoutbtn.addEventListener("click",()=>{
    localStorage.clear();
    
    const data =localStorage.getItem("content");
    console.log(data+"清空了");
    window.location.href="login.html";
})