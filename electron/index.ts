import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import "./envVars";
import {
    receiveToggleSelectFriends,
    sendFriendList,
    sendFriendListWithRankings,
    sendFriendNotifications,
    sendFriendRank,
    sendMatches,
    sendNewNotifications,
    sendNotifications,
    sendSelected,
} from "./routes";
import { makeDebug, sendToClient } from "./utils";
import isDev from "electron-is-dev";
import { connector, connectorStatus, sendConnectorStatus } from "./LCU/lcu";
import { startCheckFriendListJob } from "./jobs/friendListJob";
import { setNotificationIsNew } from "./routes/notifications";
import { startCheckCurrentSummonerRank } from "./jobs/currentSummonerRank";

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
        autoHideMenuBar: true,
        fullscreenable: true,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            // contextIsolation: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
            nodeIntegration: true,
        },
    });
    const port = process.env.PORT || 3001;
    const url = isDev ? `https://localhost:${port}` : join(__dirname, "../src/out/index.html");
    window.webContents.openDevTools();

    isDev ? window?.loadURL(url) : window?.loadFile(url);

    return window;
}
app.whenReady().then(async () => {
    debug("starting electron app");
    connector.start();
    makeWindow();
    // startCheckFriendList();
    startCheckFriendListJob();
    startCheckCurrentSummonerRank();
    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) makeWindow();
    });
});

ipcMain.on("lcu/connection", () => {
    sendConnectorStatus();
});
ipcMain.on("friendList/lastRank", sendFriendList);
ipcMain.on("friendList/friend", sendFriendRank);
ipcMain.on("friendList/ranks", sendFriendListWithRankings);
ipcMain.on("friendList/select", receiveToggleSelectFriends);
ipcMain.on("friendList/selected", () => sendSelected());
ipcMain.on("notifications", sendNotifications);
ipcMain.on("notifications/new", sendNewNotifications);
ipcMain.on("notifications/friend", sendFriendNotifications);
ipcMain.on("notifications/setNew", async () => {
    const results = await setNotificationIsNew();
    sendToClient("invalidate", "notifications");
    console.log(results);
});

ipcMain.on("friend/matches", sendMatches);
ipcMain.on("close", () => {
    window.close();
    app.exit(0);
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

app.commandLine.appendSwitch("disable-site-isolation-trials");
app.commandLine.appendSwitch("ignore-certificate-errors");
