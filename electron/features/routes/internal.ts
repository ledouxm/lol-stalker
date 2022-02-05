import { app, ipcMain, IpcMainEvent, shell } from "electron";
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
} from ".";
import { sendToClient, getDbPath } from "../../utils";
import { getCurrentSummoner, sendConnectorStatus } from "../lcu/lcu";
import { DiscordUrls, editStoreEntry, sendStore, sendStoreEntry, Store, store } from "../store";
import { makeSocketClient, sendWs } from "../ws/discord";

const getMe = async () => sendToClient("me", await getCurrentSummoner());
const setConfig: InternalCallback = async (_, data) => {
    const newConfig = { ...store.config };
    Object.entries(data).forEach(([key, val]) => (newConfig[key] = val));

    await editStoreEntry("config", newConfig);
};
const setStore: InternalCallback = async (_, payload) => {
    for (const [key, value] of Object.entries(payload)) {
        await editStoreEntry(key as keyof Store, value as any);
    }
};
const passThrough =
    (event: string, formattedData?: any): InternalCallback =>
    (_, data) =>
        sendWs(event, formattedData || data);

const getDiscordUrls = async () => {
    sendWs("discordUrls");
    store.backendSocket?.once("discordUrls", (data: DiscordUrls) =>
        editStoreEntry("discordUrls", data)
    );
};

const dlDb = () => {
    const url = getDbPath();
    shell.showItemInFolder(url);
    sendToClient("config/dl-db", "ok");
};

const openExternal: InternalCallback = (_, url: string) => {
    shell.openExternal(url);
    sendToClient("config/open-external", "ok");
};

type InternalCallback = (event: IpcMainEvent, data: any) => any;
const internalCallbacks: Record<string, InternalCallback> = {
    "friendList/lastRank": sendFriendList,
    "friendList/friend": sendFriendRank,
    "friendList/ranks": sendFriendListWithRankings,
    "friendList/select": receiveToggleSelectFriends,
    "friendList/select-all": sendSelectAllFriends,
    "friendList/selected": () => sendStoreEntry("selectedFriends"),
    "friendList/in-game": () => sendToClient("friendList/in-game", store.inGameFriends),
    "friendList/message": sendInstantMessage,
    "notifications/all": sendCursoredNotifications,
    "notifications/nb-new": sendNbNewNotifications,
    "friend/matches": sendMatches,
    "config/apex": sendApex,
    "ws/reconnect": () => !store.backendSocket && makeSocketClient(),
    config: () => sendToClient("config", store.config),
    me: getMe,
    "store/set": setStore,
    "config/set": setConfig,
    "discord/guilds": () => sendWs("guilds", { accessToken: store.discordAuth?.access_token }),
    "discord/remove-friends": passThrough("removeSummoners"),
    "discord/add-friends": passThrough("addSummoners"),
    ws: (_, data) => passThrough(data.event, data.data),
    "config/discord-urls": getDiscordUrls,
    "config/dl-db": dlDb,
    "config/open-external": openExternal,
    store: sendStore,
};

export const registerInternalRoutes = () => {
    Object.entries(internalCallbacks).forEach(([route, cb]) => ipcMain.on(route, cb));
};

ipcMain.on("close", () => {
    window.close();
    app.exit(0);
});
