import DiscordOauth2 from "discord-oauth2";
import WebSocket from "ws";
import { focusWindow } from "../..";
import { sendToClient, wsUrl } from "../../utils";
import { sendInvalidate } from "../routes";
import { DiscordAuth, editStoreEntry, store } from "../store";
export const makeSocketClient = async () => {
    try {
        if (store.backendSocket?.readyState === WebSocket.OPEN) {
            return console.log("A ws connection alreay exists");
        }

        const params = {
            ...(store.config?.socketId ? { id: store.config?.socketId } : {}),
            ...(store.discordAuth ? store.discordAuth : {}),
        };
        const search = new URLSearchParams(
            Object.entries(params).reduce(
                (acc, [key, value]) => ({ ...acc, ...(!!value ? { [key]: value } : {}) }),
                {}
            )
        );

        let timeout = null as any as NodeJS.Timer;
        const socket = new WebSocket(wsUrl + "?" + search.toString(), {});
        await editStoreEntry("socketStatus", "connecting");
        await editStoreEntry("backendSocket", socket);

        socket.onopen = async () => {
            console.log("Connection opened");
            await editStoreEntry("socketStatus", "connected");

            timeout = setInterval(() => {
                socket.send(JSON.stringify({ event: "ping", data: null }));
            }, 10000);
        };
        socket.onerror = async (error) => {
            console.error("WebSocket error");
            await editStoreEntry("socketStatus", "error");
        };

        //@ts-ignore
        socket.onmessage = (event) => onMessage({ event });
        socket.onclose = async () => {
            console.log("WebSocket close");
            await editStoreEntry("socketStatus", "closed");
            console.log("Retrying in 3s...");
            clearTimeout(timeout);
            setTimeout(() => makeSocketClient(), 3000);
        };
    } catch (error) {
        console.error(error);
    }
};

async function onMessage({ event: msgEvent }: { event: MessageEvent<ArrayBuffer | string> }) {
    const length =
        msgEvent.data instanceof ArrayBuffer ? msgEvent.data.byteLength : msgEvent.data.length;
    // Most likely a "pong" response from our "ping" message
    if (!length) return;

    const message = await decode(msgEvent.data);
    // Invalid message
    if (!message) return;

    // console.log(message, typeof message);
    const { event, data } = message;
    console.log(event, data);
    try {
        makeCallback[event]?.(data);
    } catch (e) {
        console.log(e);
    }
}
const decoder = new TextDecoder();
export const decode = async <Payload = any>(payload: ArrayBuffer | string): Promise<Payload> => {
    try {
        const data = payload instanceof ArrayBuffer ? decoder.decode(payload) : payload;
        return JSON.parse(data);
    } catch (err) {
        return null as any;
    }
};

export const oauth = new DiscordOauth2();
const makeCallback: Record<string, (data?: any) => void> = {
    id: async (data: string) => {
        await editStoreEntry("config", { ...store.config, socketId: data });
    },
    auth: async (data: DiscordAuth) => {
        sendWs("guilds", { accessToken: data.access_token });
        focusWindow();
        await editStoreEntry("discordAuth", data);
    },
    me: async (data) => {
        await editStoreEntry("me", data);
    },
    summoners: async (data) => console.log(data),
    invalidateGuilds: () => sendInvalidate("guilds"),
    discordUrls: async (data) => editStoreEntry("discordUrls", data),
    invalidToken: () => editStoreEntry("discordAuth", null),
    rateLimit: () => sendToClient("errorToast", "Rate limit error, try again later"),
    error: async (data) => sendToClient("error", data),
};

export const sendWs = (event: string, data?: any) =>
    store.backendSocket?.send(JSON.stringify({ event, data }));
