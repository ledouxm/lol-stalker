import axios from "axios";
import { atom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useChampionsList } from "../features/DataDragon/useChampionsList";
import { useItemsList } from "../features/DataDragon/useItemsList";
import { useSummonerSpellsList } from "../features/DataDragon/useSummonerSpellsList";
import { friendsAtom } from "../features/FriendList/useFriendList";
import { useApi } from "../features/hooks/useApi";
import { CurrentSummoner, FriendLastRankDto } from "../types";
import { electronRequest, sendMessage } from "../utils";
import { errorToast } from "./toasts";

export interface DiscordGuild {
    channelId: string;
    guildId: string;
    name: string;
    channelName: string;
    nbStalkers: number;
    summoners: { id: number; puuid: string; channelId: string; name: string }[];
    isRestricted: boolean;
}
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

export type SocketStatus = "initial" | "connecting" | "connected" | "error" | "closed";
export interface DiscordUrls {
    inviteUrl: string;
    authUrl: string;
}
export interface Me {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    banner?: any;
    banner_color?: any;
    accent_color?: any;
    locale: string;
    mfa_enabled: boolean;
    premium_type: number;
}
export interface Store {
    config: Record<string, any>;
    selectedFriends: Array<string> | null;
    connectorStatus: null | ConnectorStatus;
    inGameFriends: null | any[];
    discordAuth: null | DiscordAuth;
    socketStatus: SocketStatus;
    discordUrls: null | DiscordUrls;
    leagueSummoner: null | CurrentSummoner;
    me: null | Me;
}

export const storeAtom = atom<Store | null>(null);

export const lcuStatusAtom = atom((get) => get(storeAtom)?.connectorStatus);
export const configAtom = atom((get) => get(storeAtom)?.config);
export const socketStatusAtom = atom((get) => get(storeAtom)?.socketStatus);
export const selectedFriendsAtom = atom((get) => get(storeAtom)?.selectedFriends);
export const discordAuthAtom = atom((get) => get(storeAtom)?.discordAuth);
export const discordUrlsAtom = atom((get) => get(storeAtom)?.discordUrls);
export const meAtom = atom((get) => get(storeAtom)?.me);
export const leagueSummonerAtom = atom((get) => get(storeAtom)?.leagueSummoner);

export const LCUConnector = () => {
    const setFriends = useUpdateAtom(friendsAtom);
    const setStore = useUpdateAtom(storeAtom);
    const queryClient = useQueryClient();

    useQuery("store", () => electronRequest("store"), {
        onSuccess: (store) => setStore(store),
    });

    usePatchVersion();
    useChampionsList();
    useItemsList();
    useSummonerSpellsList();
    useApi();

    useEffect(() => {
        window.Main.on("invalidate", (queryName: string) =>
            queryClient.invalidateQueries(queryName)
        );
        window.Main.on("store/update", (data: Partial<Store>) =>
            setStore((store) => (store ? { ...store, ...data } : null))
        );
        window.Main.on("friendList/lastRank", (data: FriendLastRankDto[]) => setFriends([...data]));
        window.Main.on("error", (data: string) =>
            errorToast({ title: "An error has occured", description: data })
        );
        sendMessage("friendList/lastRank");

        return () =>
            window.Main.getEventNames().forEach((eventName) =>
                window.Main.off(eventName as string)
            );
    }, []);

    return null;
};

export const patchVersionAtom = atom<string>(null as unknown as string);
export const usePatchVersion = () => {
    const setPatchVersion = useUpdateAtom(patchVersionAtom);
    useQuery("version", getDataDragonVersion, {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60,
        onSuccess: (data) => setPatchVersion(data),
    });
};
export const getDataDragonVersion = async () =>
    (await axios.get("https://ddragon.leagueoflegends.com/api/versions.json")).data[0];

export interface OldFriend {
    division: string;
    tier: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    name: string;
    puuid: string;
}

export interface FriendChange {
    division: string;
    tier: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    name: string;
    puuid: string;
    oldFriend: OldFriend;
}
