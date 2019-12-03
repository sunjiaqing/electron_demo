const {remote,ipcRenderer, Dialog} = require("electron");

ipcRenderer.on("data", (event, obj) => {
    console.info(obj)
})

ipcRenderer.send("message", {name: "子窗口"})

