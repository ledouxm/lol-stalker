import { pick } from "@pastable/core";
import axios, { AxiosInstance } from "axios";
import https from "https";
import LCUConnector from "lcu-connector";
import { Friend } from "../../entities/Friend";
import { sendToClient, Tier } from "../../utils";
import { CurrentSummoner, FriendDto, MatchDto, Queue, RankedStats } from "./types";
import { editStoreEntry, Locale, store } from "../store";
import { addOrUpdateFriends } from "../routes/friends";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });
export const connector = new LCUConnector();

export const sendConnectorStatus = () => sendToClient("lcu/connection", store.connectorStatus);

connector.on("connect", async (data) => {
    editStoreEntry("connectorStatus", data);
    const { protocol, username, password, address, port } = data;
    const baseURL = `${protocol}://${username}:${password}@${address}:${port}`;
    store.lcu = axios.create({
        baseURL,
        httpsAgent,
        headers: { Authorization: `Basic ${data.password}` },
    });
    console.log("connected to riot client");

    try {
        const locale = await getRegionLocale();
        await editStoreEntry("locale", locale);
    } catch (e) {
        console.log(e);
    }
});
connector.on("disconnect", () => {
    editStoreEntry("connectorStatus", null);
});

export interface AuthData {
    address: string;
    port: number;
    username: string;
    password: string;
    protocol: string;
}

const theoPuuid = "4ab5d4e7-0e24-54ac-b8e7-2a72c8483712";
const getTheoSoloQRank = () => getSoloQRankedStats(theoPuuid);
export interface FriendChange extends FriendStats {
    oldFriend: FriendStats;
    toNotify: boolean;
    windowsNotification?: boolean;
}
export const compareFriends = async (oldFriends: FriendStats[], newFriends: FriendStats[]) => {
    const changes: FriendChange[] = [];
    oldFriends.forEach((oldFriend) => {
        const newFriend = newFriends.find((newFriend) => newFriend.puuid === oldFriend.puuid);
        if (!newFriend) return;
        if (
            newFriend.division !== oldFriend.division ||
            newFriend.tier !== oldFriend.tier ||
            newFriend.leaguePoints !== oldFriend.leaguePoints ||
            newFriend.miniSeriesProgress !== oldFriend.miniSeriesProgress
        ) {
            changes.push({
                ...newFriend,
                oldFriend,
                toNotify: !!oldFriend.division,
                windowsNotification: store.selectedFriends?.has(newFriend.puuid),
            });
        }
    });

    return changes;
};

type FriendStats = Pick<Friend, "name" | "puuid"> &
    Pick<Queue, "division" | "tier" | "leaguePoints" | "wins" | "losses" | "miniSeriesProgress">;

export const checkFriendList = async () => {
    const friends = await getFriends();
    await addOrUpdateFriends(friends);
    const stats = await getMultipleSummonerSoloQStats(friends);
    return stats;
};

export const postMessage = (payload: { summonerName: string; message: string }) => {
    const url = `/lol-game-client-chat/v1/instant-messages?summonerName=${encodeURI(
        payload.summonerName
    )}&message=${encodeURI(payload.message)}`;
    return store.lcu?.post(url);
};

export const getAllApexLeague = async () => {
    const tiers: Tier[] = ["MASTER", "GRANDMASTER", "CHALLENGER"];
    const payload: Partial<Record<Tier, number>> = {};
    for (const tier of tiers) {
        payload[tier] = (await getApexLeague(tier)).divisions[0].standings[0].leaguePoints;
    }

    return payload;
};
export const getApexLeague = (tier: RankedStats["queues"][0]["tier"]) =>
    request<any>(`/lol-ranked/v1/apex-leagues/RANKED_SOLO_5x5/${tier}`);

///lol-ranked-stats/v1/stats/{summonerId}
export const getHelp = () => request("/help?format=Console");
export const getBuild = () => request("/system/v1/builds");
export const getRegionLocale = () => request<Locale>("/riotclient/region-locale");
export const getCurrentSummoner = () =>
    request<CurrentSummoner>("/lol-summoner/v1/current-summoner");
export const getFriends = () => request<FriendDto[]>("/lol-chat/v1/friends");
export const formatFriend = (friend: FriendDto) =>
    pick(friend, ["gameName", "gameTag", "puuid", "id", "name", "summonerId", "icon"]);

export const getFriendsGroup = () => request("/lol-chat/v1/friend-groups");
export const getRankedStatsBySummonerPuuid = (puuid: string) =>
    request<RankedStats>(`/lol-ranked/v1/ranked-stats/${puuid}`);
export const getSoloQRankedStats = async (puuid: string) =>
    (await getRankedStatsBySummonerPuuid(puuid)).queues.find(
        (queue) => queue.queueType === "RANKED_SOLO_5x5"
    );
export const getMatchHistoryBySummonerPuuid = (puuid: string) =>
    request<MatchDto>(`/lol-match-history/v1/products/lol/${puuid}/matches`);
export const getMultipleSummonerSoloQStats = async (
    summoners: Pick<Friend, "puuid" | "name">[]
) => {
    const summonersRanks = [];
    for (const summoner of summoners) {
        try {
            const rank = await getSoloQRankedStats(summoner.puuid);
            if (!rank) {
                throw "no rank";
            }
            summonersRanks.push({
                ...pick(rank, [
                    "division",
                    "tier",
                    "leaguePoints",
                    "wins",
                    "losses",
                    "miniSeriesProgress",
                ]),
                ...pick(summoner, ["name", "puuid"]),
            });
        } catch (e) {
            console.log(`error retrieving soloQ stats for summoner ${summoner.name}`);
        }
    }

    return summonersRanks;
};
export const getLobbySummoners = () => {};
export const getSummonerRankedStats = () => {};

export const getSwagger = () => request("/swagger/v2/swagger.json");

type AxiosMethod = "get" | "post" | "put" | "delete" | "patch";
export const request = async <T>(uri: string, method: AxiosMethod = "get") =>
    (await store.lcu?.[method]<T>(uri))?.data as T;
