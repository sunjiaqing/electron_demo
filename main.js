const {app, BrowserWindow, ipcMain, screen, Menu, Tray} = require('electron');const path = require("path");let mainWin;let tray;/** *创建窗口对象 * @param str 载入文件 * @return  BrowserWindow */function createWin(str) {    // 页面出现 require is not defined  5.0之后 需要设置 nodeIntegration    //https://electronjs.org/docs/api/webview-tag webview被禁用 通过 //1920:1160    let tempWin = new BrowserWindow({        width: 1920,        height: 1200,        show: false,        webPreferences: {nodeIntegration: true, webviewTag: true}    });    let promise = tempWin.loadFile(str);    tempWin.once("ready-to-show", () => {        tempWin.show();    })    tempWin.on("closed", () => {        tempWin = null    })    return tempWin;}function createMainWin() {    mainWin = createWin("index.html");    mainWin.webContents.openDevTools();    let {width, height} = screen.getPrimaryDisplay().size    console.log(width, height)    mainWin.setSize(500, 500)    createAppMenu(mainWin);    //创建托盘    tray = new Tray(path.join(__dirname, "redis.png"));    global.tray = tray;    let menu = Menu.buildFromTemplate([{label: "退出", role: "quit"}]);    tray.setToolTip("这是一个托盘")    tray.setContextMenu(menu);    tray.on("double-click", () => {        console.log("双击")        tray.popUpContextMenu(menu);    })    setTimeout(() => {        console.log("自动测试测试气泡")        tray.setToolTip("自动测试测试气泡")        tray.displayBalloon({title: "自动测试测试气泡", icon:path.join(__dirname, "redis.png"),content: "测试气泡内容"})    }, 5000)}function createAppMenu(mainWin) {    let template = [        {            label: "文件", submenu: [                {                    label: "测试",                    click: () => {                        mainWin.webContents.insertText("测试")                    }                },            ]        },        {            label: "帮助",            submenu: [                {                    label: "刷新",                    role: "reload"                },                {type: "separator"},                {                    label: "关闭",                    accelerator: "q",                    role: "close"                }]        },    ]    let menu = Menu.buildFromTemplate(template);    Menu.setApplicationMenu(menu)}app.on("ready", createMainWin);app.on("window-all-closed", () => {    if (process.platform !== 'darwin') app.quit()    if (tray != null && !tray.isDestroyed()) {        console.log("托盘摧毁")        tray.destroy()    }})app.on("activate", () => {    if (mainWin === null) createMainWin();})/** * 1. 应用菜单 * 2. 上下文菜单 * * 创建菜单 *  1.模版 * * *  npm install electron-packager -g *  electron-packager . demo --asar --electron-version=7.1.2 * *  localStorage  数据存储 *  window.localStorage *  window.localStorage.setItem("",value) * * *  sql.js  sqLite  桌面级关系型数据库 * *  electron-package  打包工具 * *  npm install electron-packager -g * *  executable-name * * npm install asar -g * * 元信息潜入 windows * * * electron-packager-interactive  集成electron-packager * * * */