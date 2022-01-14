import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import "./envVars";
import {
    receiveToggleSelectFriends,
    sendFriendList,
    sendFriendListWithRankings,
    sendFriendRank,
    sendNotifications,
} from "./routes";
import { makeDebug } from "./utils";
import isDev from "electron-is-dev";
import { connector } from "./LCU/lcu";

const debug = makeDebug("index");
const height = 600;
const width = 800;

const baseBounds = { height, width };
let window: BrowserWindow;
export function makeWindow() {
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
    const port = process.env.PORT || 3001;
    const url = isDev ? `https://localhost:${port}` : join(__dirname, "../src/out/index.html");

    isDev ? window?.loadURL(url) : window?.loadFile(url);

    return window;
}
app.whenReady().then(async () => {
    debug("starting electron app");
    connector.start();
    makeWindow();
    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) makeWindow();
    });
});

ipcMain.on("lcu/connection", () => {
    console.log("salut");
    // startCheckFriendList();
});

ipcMain.on("friendList/lastRank", sendFriendList);
ipcMain.on("friendList/friend", sendFriendRank);
ipcMain.on("friendList/ranks", sendFriendListWithRankings);
ipcMain.on("friendList/select", receiveToggleSelectFriends);
ipcMain.on("notifications", sendNotifications);

ipcMain.on("close", () => {
    window.close();
    app.exit(0);
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

app.commandLine.appendSwitch("disable-site-isolation-trials");
app.commandLine.appendSwitch("ignore-certificate-errors");
