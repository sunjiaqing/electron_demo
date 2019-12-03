const {remote, ipcRenderer, webFrame} = require('electron');
const {BrowserWindow, ipcMain, dialog, screen,Menu,MenuItem} = remote;
ipcMain.on("message", (event, obj) => {
    console.info(event)
    console.info(obj)
})

ipcRenderer.on("message", (event, obj) => {
    console.info("渲染进程接收")
    console.info(obj)
})

window.onload = function () {
    console.log("index_env.js load")
    let btn = document.getElementById("crateChildWin");
    btn.addEventListener('click', () => {
        let win = new BrowserWindow({width: 500, height: 500, show: false, webPreferences: {nodeIntegration: true}});
        win.webContents.openDevTools()
        let promise = win.loadFile("child.html");
        win.once("ready-to-show", () => {
            win.show()
            win.webContents.send("data", {name: "父窗口"})
        })
        win.on("closed", () => {
            win = null
        });
    })
    let btn2 = document.getElementById("send");
    btn2.addEventListener("click", () => {
        let mainWin = remote.getCurrentWindow();
        mainWin.webContents.send("message", {name: "测试"})
        console.info("消息发送成功")
    })

    let btn3 = document.getElementById("sub");
    btn3.addEventListener("click", () => {
        let nowWim = remote.getCurrentWindow();
        let promise = dialog.showOpenDialog(nowWim, {
            title: "对话框窗口",
            buttonLabel: "测试打开",
            properties: ["openFile", "multiSelections"],
            /*      filters: [
                      {name: "javascript", extensions: ["js"]},
                      {name: "html", extensions: ["html", "xml"]},
                  ]*/
        })
        promise.then((result) => {
            console.log(result.filePaths)
        })

    })

    let btn4 = document.getElementById("subSave");
    btn4.addEventListener("click", () => {
        let promise = dialog.showSaveDialog({
            title: "保存对话框", defaultPath: ".", buttonLabel: "测试", filters: [
                {name: "javascript", extensions: ["js"]},
                {name: "html", extensions: ["html", "xml"]},
            ]
        });
        promise.then((result) => {
            console.log(result.filePath);
        })
    })
    let btn5 = document.getElementById("subMessage");
    btn5.addEventListener("click", () => {
        let promise = dialog.showMessageBox(remote.getCurrentWindow(), {
            type: "warning",
            title: "messageBox",
            message: "测试消息",
            detail: "额外消息",
            checkboxLabel: "请同意",
            checkboxChecked: false,
            buttons: ["test1", "test2"],
            icon: null
        });
        promise.then((result) => {
            //checkboxChecked 不会发生变化win10 bug
            console.log(result.checkboxChecked);
            console.log(result.response);
        })
        console.log(promise)
    })
    var bWin;
    click("openWin", () => {
        bWin = window.open("./sub.html", "", "height=400,width=400");

        /*      setTimeout(() => {
                   console.info("获取焦点")
                   bWin.focus();
               }, 1000)
               setTimeout(() => {
                   console.info("失去焦点")
                   bWin.blur();
               }, 2000)
               setTimeout(() => {
                   console.info("获取焦点")
                   bWin.focus();
               }, 3000)
              setTimeout(() => {
                   console.info("打印窗口")
                  bWin.print();
               }, 4000)
               setTimeout(() => {
                   console.info("关闭窗口")
                   bWin.close();
               }, 5000)*/

    })

    click("postMessage", () => {
        if (bWin !== undefined && bWin !== null) {
            console.log("postMessage")
            bWin.postMessage({name: "测试"}, "*");
        }
        let {width, height} = screen.getPrimaryDisplay().workAreaSize;
        console.log(width + ":" + height)
    })

    let webView = document.getElementById("webView1");
    webView.addEventListener("did-start-loading", () => {
        console.log("load start")
    })
    webView.addEventListener("did-stop-loading", () => {
        console.log("load stop")
    })
    /*
    //缩放
    setTimeout(()=>{
            console.log("ZoomLevel")
            webFrame.setZoomLevel(webFrame.getZoomLevel()+3)
        },1000)
        setTimeout(()=>{
            webFrame.setZoomLevel(webFrame.getZoomLevel()+3)
        },3000)
        setTimeout(()=>{
            webFrame.setZoomLevel(webFrame.getZoomLevel()-3)
        },5000)
        setTimeout(()=>{
            webFrame.setZoomLevel(webFrame.getZoomLevel()-3)
        },6000)*/

    let mainWin = remote.getCurrentWindow();
    let {width, height} = screen.getPrimaryDisplay().size;
    console.log(width + ":" + height)

    setTimeout(() => {
        let {x, y} = screen.getCursorScreenPoint();
        console.log(x, y)

    }, 5000)

    click("progressBar", () => {
        console.info("设置任务栏无效")
        //none, normal, indeterminate, error, 或 paused.
        mainWin.setProgressBar(0.2, {mode: "normal"})
    })


    //上下文菜单+自定义菜单
    let menu = new Menu();

    let menuCopyItem = new MenuItem({label:"粘贴",role:"copy"});
    let menuSeparatorItem = new MenuItem(   {type: "separator"});
    let menuFileItem = new MenuItem({label:"文件",submenu:[menuCopyItem]});
    let menuTestItem = new MenuItem({label:"测试",click:()=>{console.log("测试-----------------")}});
    menu.append(menuFileItem)
    menu.append(menuSeparatorItem)
    menu.append(menuTestItem)
    let contentMenu = document.getElementById("contentMenu");
    contentMenu.addEventListener("contextmenu", (env) => {
        //取消事件的默认动作
        env.preventDefault()
        console.log(env);
        console.log(env.x)
        menu.popup({x:env.x,y:env.y,callback:()=>{console.log("关闭回调")}})
    })

}

function click(strId, fnc) {
    let btn = document.getElementById(strId);
    btn.addEventListener("click", fnc)
}


/**
 *   filters: [
 { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
 { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
 { name: 'Custom File Type', extensions: ['as'] },
 { name: 'All Files', extensions: ['*'] }
 ]
 */

/**
 托盘图标  Tray
 */