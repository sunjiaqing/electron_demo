const {remote} = require("electron")
//remote.getCurrentWindow().webContents.openDevTools();
window.onload = function () {
    console.log("注册")
    window.addEventListener("message", (result) => {
        console.log(result)
    })
    setTimeout(() => {
        window.parent.postMessage({name: "huoquwin"}, "*");
    }, 1000);
}

function click(strId, fnc) {
    let btn = document.getElementById(strId);
    btn.addEventListener("click", fnc)
}