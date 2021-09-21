import { join } from "path";
import fs from "fs";
import { BrowserWindow, app, ipcMain, ipcRenderer } from "electron";
import isDev from "electron-is-dev";
import { addListener, createListener } from "./sniffer";
import { Packet } from "./sniffer/killian";
import mapPositions from "./data/mapPositions.json";
import { MapPosition } from "./types";

const height = 600;
const width = 800;

const baseBounds = { height, width };
let window: BrowserWindow;
function createWindow() {
    let data = null;
    try {
        const content = fs.readFileSync("./bounds.json", "utf8");
        data = JSON.parse(content);
        console.log(data);
    } catch (e) {}

    // Create the browser window.
    window = new BrowserWindow({
        ...(data?.bounds || baseBounds),
        frame: false,
        show: true,
        resizable: true,
        fullscreenable: true,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            webSecurity: false,
            nodeIntegration: true,
        },
    });
    window.setAlwaysOnTop(true, "status");

    const port = process.env.PORT || 3000;
    const url = isDev ? `http://localhost:${port}` : join(__dirname, "../src/out/index.html");

    // and load the index.html of the app.
    isDev ? window?.loadURL(url) : window?.loadFile(url);

    // Open the DevTools.
    // window.webContents.openDevTools();

    window.on("close", () => {
        const data = { bounds: window.getBounds() };
        const stringified = JSON.stringify(data);
        fs.writeFileSync("./bounds.json", stringified);
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    createListener();

    addListener({
        filters: "CurrentMapMessage",
        callback: (kPacket: Packet) => {
            const mapId = kPacket.message.readDoubleBE();
            const position = (mapPositions as MapPosition[]).find(
                (position: any) => position.id == mapId
            );
            const payload = {
                x: position?.posX,
                y: position?.posY,
            };

            window.webContents.send("position", JSON.stringify(payload));

            console.log(payload);
        },
    });

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
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
