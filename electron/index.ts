import dotenv from "dotenv";
import { app, BrowserWindow, dialog } from "electron";
import isDev from "electron-is-dev";
import path from "path";
import { makeDb } from "./db";
import { startCheckCurrentSummonerRank } from "./jobs/currentSummonerRank";
import { startCheckFriendListJob } from "./jobs/friendListJob";
import { connector } from "./features/lcu/lcu";
import { registerInternalRoutes } from "./features/routes/internal";
import { makeSocketClient } from "./features/ws/discord";
import { loadStore } from "./features/store";
dotenv.config();

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
            preload: path.join(__dirname, "preload.js"),
            webSecurity: false,
            allowRunningInsecureContent: true,
            nodeIntegration: true,
        },
    });
    const port = process.env.PORT || 3001;
    const url = isDev ? `https://localhost:${port}` : path.join(__dirname, "../src/out/index.html");
    // window.webContents.openDevTools();

    isDev ? window?.loadURL(url) : window?.loadFile(url);

    return window;
}

// Create window, load the rest of the app, etc...
app.whenReady().then(async () => {
    await makeDb();
    await loadStore();
    connector.start();
    registerInternalRoutes();
    makeSocketClient();
    makeWindow();
    window.webContents.on("will-navigate", function (event, newUrl) {
        console.log(newUrl);
        // More complex code to handle tokens goes here
    });

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
    app.on("open-url", (event, url) => {
        console.log("oui");
        dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
    });
});

// Handle the protocol. In this case, we choose to show an Error Box.
app.on("open-url", (event, url) => {
    dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
});

app.setAppUserModelId("LoL Stalker");

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

app.commandLine.appendSwitch("disable-site-isolation-trials");
app.commandLine.appendSwitch("ignore-certificate-errors");
