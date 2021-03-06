import dotenv from "dotenv";
dotenv.config();
import { app, BrowserWindow, ipcMain, shell } from "electron";
import isDev from "electron-is-dev";
import path, { join } from "path";
import { config, loadConfig, persistConfig } from "./config";
import { makeDb } from "./db";
import { startCheckCurrentSummonerRank } from "./jobs/currentSummonerRank";
import { startCheckFriendListJob } from "./jobs/friendListJob";
import { connector, sendConnectorStatus } from "./LCU/lcu";
import {
    receiveToggleSelectFriends,
    sendApex,
    sendCursoredNotifications,
    sendFriendList,
    sendFriendListWithRankings,
    sendFriendRank,
    sendInstantMessage,
    sendMatches,
    sendNbNewNotifications,
    sendSelectAllFriends,
    sendSelected,
} from "./routes";
import { inGameFriends } from "./routes/friends";
import { loadSelectedFriends } from "./selection";
import { sendToClient } from "./utils";

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
    // window.webContents.openDevTools();

    isDev ? window?.loadURL(url) : window?.loadFile(url);

    return window;
}
app.whenReady().then(async () => {
    await makeDb();
    connector.start();
    await loadSelectedFriends();
    await loadConfig();
    makeWindow();
    startCheckFriendListJob();
    startCheckCurrentSummonerRank();
    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) makeWindow();
    });
    app.on("window-all-closed", () => {
        app.quit();
        process.exit(0);
    });
});
app.setAppUserModelId("LoL Stalker");

ipcMain.on("lcu/connection", () => {
    sendConnectorStatus();
});
ipcMain.on("friendList/lastRank", sendFriendList);
ipcMain.on("friendList/friend", sendFriendRank);
ipcMain.on("friendList/ranks", sendFriendListWithRankings);
ipcMain.on("friendList/select", receiveToggleSelectFriends);
ipcMain.on("friendList/select-all", sendSelectAllFriends);
ipcMain.on("friendList/selected", () => sendSelected());
ipcMain.on("friendList/in-game", () => sendToClient("friendList/in-game", inGameFriends.current));
ipcMain.on("friendList/message", sendInstantMessage);

ipcMain.on("notifications/all", sendCursoredNotifications);
ipcMain.on("notifications/nb-new", sendNbNewNotifications);
ipcMain.on("friend/matches", sendMatches);

ipcMain.on("config/apex", sendApex);

ipcMain.on("config", () => sendToClient("config", config.current));
ipcMain.on("config/set", async (_, data) => {
    Object.entries(data).forEach(([key, val]) => (config.current![key] = val));
    sendToClient("config/set", "ok");
    sendToClient("invalidate", "config");
    await persistConfig();
});

ipcMain.on("config/dl-db", () => {
    const url = path.join(
        __dirname,
        isDev ? "../database/lol-stalker.db" : "./database/lol-stalker.db"
    );
    shell.showItemInFolder(url);
    sendToClient("config/dl-db", "ok");
});

ipcMain.on("config/open-external", (_, url: string) => {
    shell.openExternal(url);
    sendToClient("config/open-external", "ok");
});

ipcMain.on("close", () => {
    window.close();
    app.exit(0);
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

app.commandLine.appendSwitch("disable-site-isolation-trials");
app.commandLine.appendSwitch("ignore-certificate-errors");
