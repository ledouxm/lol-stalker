import { Friend } from "../../entities/Friend";
import { sendToClient } from "../../utils";
import { getAllApexLeague, getMatchHistoryBySummonerPuuid, postMessage } from "../lcu/lcu";
import { sendStoreEntry, store } from "../store";
import {
    getFriendAndRankingsFromDb,
    getFriendsAndLastRankingFromDb,
    getFriendsAndRankingsFromDb,
    selectAllFriends,
    toggleSelectFriends,
} from "./friends";
import {
    getCursoredNotifications,
    getNbNewNotifications,
    NotificationFilters,
    setNotificationIsNew,
} from "./notifications";

export const sendFriendList = async () => {
    const groups = await getFriendsAndLastRankingFromDb();
    sendToClient("friendList/lastRank", groups);
};

export const sendInvalidate = async (queryName: string) => sendToClient("invalidate", queryName);

export const sendFriendRank = async (_: any, puuid: Friend["puuid"]) => {
    const groups = await getFriendAndRankingsFromDb(puuid);
    sendToClient("friendList/friend", groups);
};

export const sendFriendListWithRankings = async () => {
    const groups = await getFriendsAndRankingsFromDb();
    sendToClient("friendList/lastRank", groups);
};

export const sendCursoredNotifications = async (_: any, filters: NotificationFilters) => {
    const payload = await getCursoredNotifications(filters);
    sendToClient("notifications/all", payload);
    await setNotificationIsNew(payload.content.map((content) => content.id));
};

export const sendNbNewNotifications = async (
    _: any,
    filters: { currentMaxId: number } & NotificationFilters
) => {
    const nb = await getNbNewNotifications(filters);
    sendToClient("notifications/nb-new", nb);
};

export const sendSelectAllFriends = async (_: any, select: boolean) => {
    await selectAllFriends(select);
    sendStoreEntry("selectedFriends");
};

export const sendMatches = async (_: any, puuid: Friend["puuid"]) => {
    const matches = await getMatchHistoryBySummonerPuuid(puuid);
    sendToClient("friend/matches", matches);
};

export type SelectEventType = "add" | "remove" | "";
export const receiveToggleSelectFriends = async (
    _: any,
    data: {
        type: SelectEventType;
        puuids: Friend["puuid"] | Friend["puuid"][];
    }
) => {
    const { type, puuids } = data;
    const payload = Array.isArray(puuids) ? puuids : [puuids];

    await toggleSelectFriends(payload, type === "add");
    sendStoreEntry("selectedFriends");
};

export const sendApex = async () => {
    const payload = await getAllApexLeague();
    sendToClient("config/apex", payload);
};

export const sendInstantMessage = async (_: any, { summonerName }: { summonerName: string }) => {
    if (!store.config) return;
    await postMessage({ summonerName, message: store.config.defaultLossMessage });
    sendToClient("friendList/message", "ok");
};
