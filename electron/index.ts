import { app, BrowserWindow, ipcMain } from "electron";
import isDev from "electron-is-dev";
import { join } from "path";
import { startCheckCurrentSummonerRank } from "./jobs/currentSummonerRank";
import { startCheckFriendListJob } from "./jobs/friendListJob";
import { connector, sendConnectorStatus } from "./LCU/lcu";
import {
    receiveToggleSelectFriends,
    sendCursoredNotifications,
    sendFriendList,
    sendFriendListWithRankings,
    sendFriendNotifications,
    sendFriendRank,
    sendMatches,
    sendNbNewNotifications,
    sendSelectAllFriends,
    sendSelected,
} from "./routes";
import { setNotificationIsNew } from "./routes/notifications";
import { loadSelectedFriends } from "./selection";
import { makeDebug, sendToClient } from "./utils";

const debug = makeDebug("index");
const height = 600;
const width = 1200;

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
    await loadSelectedFriends();
    makeWindow();
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
ipcMain.on("friendList/select-all", sendSelectAllFriends);
ipcMain.on("friendList/selected", () => sendSelected());
ipcMain.on("notifications/friend", sendFriendNotifications);
ipcMain.on("notifications/all", sendCursoredNotifications);
ipcMain.on("notifications/nb-new", sendNbNewNotifications);

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
