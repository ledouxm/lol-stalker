import { Notification } from "electron";
import { Friend } from "../entities/Friend";
import { checkFriendList, compareFriends, getAllApexLeague } from "../features/lcu/lcu";
import { getRankDifference, sendToClient, Tier } from "../utils";
import { getFriendsAndLastRankingFromDb, addRanking } from "../features/routes/friends";
import { addNotification } from "../features/routes/notifications";
import { sendWs } from "../features/ws/discord";
import { editStoreEntry, store } from "../features/store";
import { sendInvalidate } from "../features/routes";

export const startCheckFriendListJob = async () => {
    try {
        if (!store.connectorStatus) throw "not connected to LCU";
        console.log("start checking friendlist");
        await editStoreEntry("friends", await getFriendsAndLastRankingFromDb());
        if (!store.friends?.length) {
            const friendListStats = await checkFriendList();
            await editStoreEntry("friends", friendListStats);
        }

        while (true) {
            const friendListStats = await checkFriendList();
            const changes = await compareFriends(store.friends!, friendListStats);
            const apexFromLCU = await getAllApexLeague();
            if (changes.length) {
                console.log(
                    `${changes.length} change${changes.length > 1 ? "s" : ""} found in friendList`
                );
                for (const change of changes) {
                    await addRanking(change as any, change.puuid);

                    if (change.toNotify) {
                        const notification = getRankDifference(
                            change.oldFriend as any,
                            change as any
                        );

                        const apex =
                            apexFromLCU[change.oldFriend.tier as Tier] ||
                            apexFromLCU[change.tier as Tier];

                        const payload = {
                            // ...notification,
                            fromDivision: change.oldFriend.division,
                            fromTier: change.oldFriend.tier,
                            fromLeaguePoints: change.oldFriend.leaguePoints,
                            fromMiniSeriesProgress: change.oldFriend.miniSeriesProgress,
                            toDivision: change.division,
                            toTier: change.tier,
                            toLeaguePoints: change.leaguePoints,
                            toMiniSeriesProgress: change.miniSeriesProgress,
                            puuid: change.puuid,
                            name: change.name,
                            apex,
                        };

                        sendWs("update", payload);

                        const friend = new Friend();
                        friend.puuid = change.puuid;
                        if (store.config?.windowsNotifications && change.windowsNotification)
                            new Notification({
                                title: change.name,
                                body: notification.content,
                            }).show();
                        await addNotification({ ...notification, friend });
                    }
                }
                sendInvalidate("notifications/nb-new");
            } else {
                console.log("no soloQ played by friends");
            }
            await editStoreEntry("friends", friendListStats);

            await new Promise((resolve) => setTimeout(resolve, 10000));
        }
    } catch (e) {
        console.log(e);
        console.log("Retrying in 5s...");
        setTimeout(() => startCheckFriendListJob(), 5000);
    }
};
