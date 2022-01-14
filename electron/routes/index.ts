import { Prisma } from "@prisma/client";
import { makeDebug, sendToClient } from "../utils";
import {
    getFriendAndRankingsFromDb,
    getFriendsAndLastRankingFromDb,
    getFriendsAndRankingsFromDb,
    getNotifications,
    getFriendNotifications,
    getSelectedFriends,
    toggleSelectFriends,
} from "./friends";
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

export const sendNotifications = async () => {
    const notifications = await getNotifications();
    sendToClient("notifications", notifications);
};

export const sendFriendNotifications = async (_: any, puuid: Prisma.FriendCreateInput["puuid"]) => {
    const groups = await getFriendNotifications(puuid);
    sendToClient("notifications/friend", groups);
};

export const sendSelected = async () => {
    const selected = await getSelectedFriends();
    sendToClient("friendList/selected", selected);
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
