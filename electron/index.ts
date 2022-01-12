import { join } from "path";
import { BrowserWindow, app, ipcMain, ipcRenderer, Notification } from "electron";
import isDev from "electron-is-dev";
import { connectorStatus } from "./LCU/lcu";

const height = 600;
const width = 800;

const baseBounds = { height, width };
let window: BrowserWindow;
function createWindow() {
    // Create the browser window.
    window = new BrowserWindow({
        ...baseBounds,
        frame: true,
        show: true,
        resizable: true,
        fullscreenable: true,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            webSecurity: false,
            allowRunningInsecureContent: true,
            nodeIntegration: true,
        },
    });
    // window.setAlwaysOnTop(true, "status");

    const port = process.env.PORT || 3000;
    console.log(isDev);
    const url = isDev ? `https://localhost:${port}` : join(__dirname, "../src/out/index.html");

    // and load the index.html of the app.
    isDev ? window?.loadURL(url) : window?.loadFile(url);

    // Open the DevTools.
    // window.webContents.openDevTools();

    // window.on("close", () => {
    //     const data = { bounds: window.getBounds() };
    //     const stringified = JSON.stringify(data);
    //     fs.writeFileSync("./bounds.json", stringified);
    // });

    return window;
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.commandLine.appendSwitch("ignore-certificate-errors");
app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

ipcMain.on("lcu/connection", () => {
    console.log("salut");
    window.webContents.send("lcu/connection", connectorStatus.current);
});

ipcMain.on("close", () => {
    window.close();
    app.exit(0);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

app.commandLine.appendSwitch("disable-site-isolation-trials");
