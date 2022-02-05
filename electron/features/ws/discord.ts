import { client as WebSocketClient, connection } from "websocket";
import DiscordOauth2 from "discord-oauth2";
import { pick } from "@pastable/core";
import fs from "fs/promises";
import electronIsDev from "electron-is-dev";
import { DiscordAuth, editStoreEntry, store } from "../store";
import { sendToClient } from "../../utils";
export const makeSocketClient = () => {
    const client = new WebSocketClient();

    client.on("connectFailed", function (error) {
        console.log("Connect Error: " + error.toString());
    });

    client.on("connect", async function (connection) {
        console.log("WebSocket Client Connected");
        store.backendSocket = connection;

        await editStoreEntry("socketStatus", "connected");

        const interval = setInterval(() => sendWs("ping"), 5000);

        if (store.discordAuth?.access_token) {
            sendWs("guilds", { accessToken: store.discordAuth.access_token });
        }

        connection.on("error", async function (error) {
            console.log("Connection Error: " + error.toString());
            await editStoreEntry("socketStatus", "error");
        });

        connection.on("close", async function () {
            store.backendSocket = null as any as connection;
            clearInterval(interval);
            console.log("echo-protocol Connection Closed");
            await editStoreEntry("socketStatus", "closed");
        });

        connection.on("message", function (message) {
            if (message.type === "utf8") {
                const { event, data } = JSON.parse(message.utf8Data);
                console.log("received", event, data);
                makeCallback[event]?.(data);

                console.log(store.config.socketId);
            }
        });
    });

    console.log(
        (electronIsDev ? "http://localhost:8080/ws" : "https://back.chainbreak.dev/ws") +
            (store.config.socketId ? `?id=${store.config.socketId}` : "")
    );
    console.log(store);
    const params = {
        ...(store.config.socketId ? { id: store.config.socketId } : {}),
        ...(store.discordAuth ? store.discordAuth : {}),
    };
    console.log("params", params);
    const search = new URLSearchParams(
        Object.entries(params).reduce(
            (acc, [key, value]) => ({ ...acc, ...(!!value ? { [key]: value } : {}) }),
            {}
        )
    );

    client.connect(
        (electronIsDev ? "http://localhost:8080/ws" : "https://back.chainbreak.dev/ws") +
            "?" +
            search.toString(),
        "echo-protocol"
    );

    return client;
};

export const oauth = new DiscordOauth2();
const makeCallback: Record<string, (data?: any) => void> = {
    id: async (data: string) => {
        await editStoreEntry("config", { ...store.config, socketId: data });
    },
    guilds: async (guilds: string[]) => {
        console.log("guilds", guilds);
        await editStoreEntry("userGuilds", guilds);
    },
    auth: async (data: DiscordAuth) => {
        console.log("logged in", data);
        sendWs("guilds", { accessToken: data.access_token });
        await editStoreEntry("discordAuth", data);
    },
    me: async (data) => {
        console.log("me", data);
        await editStoreEntry("me", data);
    },
    summoners: async (data) => console.log(data),
    "summoners/add": async () => sendWs("guilds", { accessToken: store.discordAuth?.access_token }),
    "summoners/remove": async () =>
        sendWs("guilds", { accessToken: store.discordAuth?.access_token }),
    discordUrls: async (data) => editStoreEntry("discordUrls", data),
    invalidToken: () => editStoreEntry("discordAuth", null),
};

export const sendWs = (event: string, data?: any) =>
    store.backendSocket?.send(JSON.stringify({ event, data }));
