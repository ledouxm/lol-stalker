import { wsUrl } from "../../utils";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const encode = <Payload>(payload: Payload) => encoder.encode(JSON.stringify(payload));

// export const WS = isServer() ? require("ws") : WebSocket;

export const serialize = (data: Record<string, any>) => {
    let payload: Record<string, any> = {};
    for (const key in data) {
        if (typeof data[key] === "object") {
            payload[key] = JSON.stringify(data[key]);
        } else {
            payload[key] = data[key];
        }
    }

    return payload;
};

export const getQueryString = (data: Record<string, any>) =>
    new URLSearchParams(serialize(data)).toString();

export const getWebsocketURL = () => wsUrl;

// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
export enum SocketReadyState {
    CONNECTING,
    OPEN,
    CLOSING,
    CLOSED,
}

export enum WsEvent {
    Connecting = "_connecting_",
    Open = "open",
    Close = "close",
    Error = "error",
    Any = "_msg_",
    Reconnected = "_reconnected_",
}
