import axios, { AxiosInstance } from "axios";
import https from "https";
import LCUConnector from "lcu-connector";
import { CurrentSummoner, FriendDto, Queue, RankedStats } from "./types";
import { pick } from "@pastable/core";
import { Prisma } from "@prisma/client";
import {
    addNotification,
    addOrUpdateFriends,
    addRanking,
    getFriendsAndLastRankingFromDb,
    getSelectedFriends,
} from "../routes/friends";
import { getRankDifference, makeDebug, sendToClient } from "../utils";

const debug = makeDebug("LCU");

const httpsAgent = new https.Agent({ rejectUnauthorized: false });
export const connector = new LCUConnector();
export const connectorStatus = {
    current: null as any,
    api: null as unknown as AxiosInstance,
};
connector.on("connect", async (data) => {
    connectorStatus.current = data;
    const { protocol, username, password, address, port } = data;
    const baseURL = `${protocol}://${username}:${password}@${address}:${port}`;
    connectorStatus.api = axios.create({
        baseURL,
        httpsAgent,
        headers: { Authorization: `Basic ${data.password}` },
    });
    console.log("connected to riot client");
    startCheckFriendList();
});
connector.on("disconnect", () => {
    connectorStatus.current = null;
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
export const startCheckFriendList = async () => {
    console.log("start checking friendlist");
    friendsRef.current = await getFriendsAndLastRankingFromDb();

    if (!friendsRef.current?.length) {
        const friendListStats = await checkFriendList();
        friendsRef.current = friendListStats;
    }

    while (true) {
        const friendListStats = await checkFriendList();
        const changes = compareFriends(friendsRef.current, friendListStats);
        if (changes.length) {
            const selectedFriends = await getSelectedFriends();

            const toNotify: FriendChange[] = [];
            console.log("changes", changes);
            for (const change of changes) {
                await addRanking(change, change.puuid);
                const notification = getRankDifference(change.oldFriend as any, change as any);
                await addNotification({ ...notification, puuid: change.puuid });
                if (selectedFriends.find((friend) => friend.puuid === change.puuid))
                    toNotify.push(change);
            }
            sendToClient("friendList/changes", toNotify);
            sendToClient("invalidate", "notification");
        } else console.log("no soloQ played by friends");

        friendsRef.current = friendListStats;

        await new Promise((resolve) => setTimeout(resolve, 10000));
    }
};

interface FriendChange extends FriendStats {
    oldFriend: FriendStats;
}
const compareFriends = (oldFriends: FriendStats[], newFriends: FriendStats[]) => {
    const changes: FriendChange[] = [];
    oldFriends.forEach((oldFriend) => {
        const newFriend = newFriends.find((newFriend) => newFriend.puuid === oldFriend.puuid);
        if (!newFriend) return;
        if (
            newFriend.division !== oldFriend.division ||
            newFriend.tier !== oldFriend.tier ||
            newFriend.leaguePoints !== oldFriend.leaguePoints
        ) {
            changes.push({ ...newFriend, oldFriend });
        }
    });

    return changes;
};

type FriendStats = Pick<Prisma.FriendCreateInput, "name" | "puuid"> &
    Pick<Queue, "division" | "tier" | "leaguePoints" | "wins" | "losses">;

const friendsRef = {
    current: null as any,
};

export const checkFriendList = async () => {
    const friends = await getFriends();
    debug(`fetched ${friends.length} friends`);
    await addOrUpdateFriends(friends);
    const stats = await getMultipleSummonerSoloQStats(friends);
    debug(`fetched stats ${stats.length}`);
    return stats;
};

///lol-ranked-stats/v1/stats/{summonerId}
export const getHelp = () => request("/help?format=Console");
export const getBuild = () => request("/system/v1/builds");
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
export const getMultipleSummonerSoloQStats = async (
    summoners: Pick<Prisma.FriendCreateInput, "puuid" | "name">[]
) => {
    const summonersRanks = [];
    for (const summoner of summoners) {
        // debug(`checking rank for friend ${summoner.name}`);
        try {
            const rank = await getSoloQRankedStats(summoner.puuid);
            if (!rank) {
                debug("no rank found");
                throw "no rank";
            }
            // debug(formatRank(rank));
            summonersRanks.push({
                ...pick(rank, ["division", "tier", "leaguePoints", "wins", "losses"]),
                ...pick(summoner, ["name", "puuid"]),
            });
        } catch (e) {
            console.log(`error retrieving soloQ stats for summoner ${summoner.name}`);
        }
    }

    return summonersRanks;
};

export const getSwagger = () => request("/swagger/v2/swagger.json");

type AxiosMethod = "get" | "post" | "put" | "delete" | "patch";
export const request = async <T>(uri: string, method: AxiosMethod = "get") =>
    (await connectorStatus.api[method]<T>(uri)).data as T;
