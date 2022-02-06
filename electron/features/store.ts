import fs from "fs/promises";
import { AxiosInstance } from "axios";
import { connection } from "websocket";
import { sendToClient } from "../utils";
import path from "path";
import electronIsDev from "electron-is-dev";
import { CurrentSummoner } from "./lcu/types";
import { app } from "electron";

export const initialConfig = {
    windowsNotifications: true,
    dirname: __dirname,
    defaultLossMessage:
        "\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}",
};

export interface ConnectorStatus {
    address: string;
    port: number;
    username: string;
    password: string;
    protocol: string;
}
export interface DiscordAuth {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}
export type SocketStatus =
    | "initial"
    | "connecting"
    | "connected"
    | "error"
    | "closed"
    | "can't reach server";
export interface DiscordUrls {
    inviteUrl: string;
    authUrl: string;
}
export interface Store {
    config: Record<string, any>;
    selectedFriends: Set<string> | null;
    connectorStatus: null | ConnectorStatus;
    lcu: null | AxiosInstance;
    inGameFriends: null | any[];
    backendSocket: null | connection;
    userGuilds: null | string[];
    discordAuth: null | DiscordAuth;
    friends: null | any[];
    socketStatus: SocketStatus;
    discordUrls: null | DiscordUrls;
    leagueSummoner: null | CurrentSummoner;
    me: any | null;
}

interface StoreConfig {
    persist?: boolean;
    notifyOnChange?: boolean;
    formatter?: (data: any) => any;
    onLoad?: (data: any) => any;
}

export const store: Store = {
    config: initialConfig,
    selectedFriends: null,
    connectorStatus: null,
    lcu: null,
    inGameFriends: null,
    backendSocket: null,
    userGuilds: null,
    discordAuth: null,
    friends: null,
    socketStatus: "initial",
    discordUrls: null,
    leagueSummoner: null,
    me: null,
};

const storeConfig: Partial<Record<keyof Store, StoreConfig>> = {
    config: {
        persist: true,
        notifyOnChange: true,
    },
    discordAuth: {
        notifyOnChange: true,
        persist: true,
    },
    discordUrls: {
        notifyOnChange: true,
        persist: true,
    },
    selectedFriends: {
        persist: true,
        notifyOnChange: true,
        formatter: (data: Set<string>) => data && Array.from(data),
        onLoad: (data: string[]) => data && new Set(data),
    },
    inGameFriends: {
        notifyOnChange: true,
    },
    userGuilds: {
        notifyOnChange: true,
    },
    connectorStatus: {
        notifyOnChange: true,
    },
    socketStatus: {
        notifyOnChange: true,
    },
    me: {
        notifyOnChange: true,
        persist: true,
    },
    leagueSummoner: {
        notifyOnChange: true,
    },
};

export const editStoreEntry = async <Entry extends keyof Store>(
    entryName: Entry,
    value: Store[Entry]
) => {
    const config = storeConfig[entryName];
    store[entryName] = value;

    const payload = config?.formatter?.(value) || value;

    if (config?.persist) {
        await fs.writeFile(getJsonPath(entryName), JSON.stringify(payload, null, 4));
    }

    if (config?.notifyOnChange) {
        sendStoreEntry(entryName, payload);
    }
};

export const sendStoreEntry = (entryName: keyof Store, formattedValue?: any) => {
    const payload = formattedValue || getValue(entryName);
    sendToClient("store/update", { [entryName]: payload });
};

export const getValue = (entryName: keyof Store) =>
    storeConfig[entryName]?.formatter?.(store[entryName]) || store[entryName];

export const loadStore = async () => {
    try {
        await fs.stat(jsonFolderPath);
        await fs.readdir(jsonFolderPath);
    } catch (e) {
        console.log(e);
        await fs.mkdir(jsonFolderPath);
    }

    const persisted = Object.entries(storeConfig)
        .filter(([_, config]) => config.persist)
        .map(([entryName]) => entryName as keyof Store);
    for (const entryName of persisted) {
        try {
            const stored = JSON.parse(await fs.readFile(getJsonPath(entryName), "utf-8"));
            if (stored) {
                store[entryName] = storeConfig[entryName]?.onLoad?.(stored) || stored;
            }
        } catch (e) {
            console.log("Couldn't load ", entryName + ".json");
            console.error(e);
        }
    }
};

const jsonFolderPath = path.join(app.getPath("userData"), "jsons");
const getJsonPath = (name: string) => path.join(jsonFolderPath, name + ".json");

export const sendStore = () => {
    const notified = Object.entries(storeConfig)
        .filter(([_, config]) => config.notifyOnChange)
        .map(([entryName]) => entryName as keyof Store);

    const payload = notified.reduce(
        (acc, entryName) => ({
            ...acc,
            [entryName]: storeConfig[entryName]?.formatter?.(store[entryName]) || store[entryName],
        }),
        {}
    );

    sendToClient("store", payload);
};
