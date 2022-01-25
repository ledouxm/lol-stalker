import { getMatchHistoryBySummonerPuuid } from "../LCU/lcu";
import { Prisma } from "../prismaClient";
import { makeDebug, sendToClient } from "../utils";
import {
    getFriendAndRankingsFromDb,
    getFriendsAndLastRankingFromDb,
    getFriendsAndRankingsFromDb,
    getSelectedFriends,
    toggleSelectFriends,
} from "./friends";
import {
    getNotifications,
    getFriendNotifications,
    PaginationOptions,
    getNewNotifications,
} from "./notifications";
const debug = makeDebug("routes");

export const sendFriendList = async () => {
    const groups = await getFriendsAndLastRankingFromDb();
    sendToClient("friendList/lastRank", groups);
};

export const sendInvalidate = async (queryName: string) => sendToClient("invalidate", queryName);

export const sendFriendRank = async (_: any, puuid: Prisma.FriendCreateInput["puuid"]) => {
    const groups = await getFriendAndRankingsFromDb(puuid);
    sendToClient("friendList/friend", groups);
};

export const sendFriendListWithRankings = async () => {
    const groups = await getFriendsAndRankingsFromDb();
    sendToClient("friendList/lastRank", groups);
};

export const sendNotifications = async (_: any, options: PaginationOptions = {}) => {
    const notifications = await getNotifications(options);
    sendToClient("notifications", notifications);
};

export const sendNewNotifications = async (_: any, options: PaginationOptions = {}) => {
    const notifications = await getNewNotifications(options);
    sendToClient("notifications/new", notifications);
};

export const sendFriendNotifications = async (_: any, puuid: Prisma.FriendCreateInput["puuid"]) => {
    const groups = await getFriendNotifications(puuid);
    sendToClient("notifications/friend", groups);
};

export const sendSelected = async () => {
    const selected = await getSelectedFriends();
    sendToClient("friendList/selected", selected);
};

export const sendMatches = async (_: any, puuid: Prisma.FriendCreateInput["puuid"]) => {
    const matches = await getMatchHistoryBySummonerPuuid(puuid);
    sendToClient("friend/matches", matches);
};

export type SelectEventType = "add" | "remove" | "";
export const receiveToggleSelectFriends = async (
    _: any,
    data: {
        type: SelectEventType;
        puuids: Prisma.FriendCreateInput["puuid"] | Prisma.FriendCreateInput["puuid"][];
    }
) => {
    const { type, puuids } = data;
    const payload = Array.isArray(puuids) ? puuids : [puuids];

    await toggleSelectFriends(payload, type === "add");
    sendSelected();
};
