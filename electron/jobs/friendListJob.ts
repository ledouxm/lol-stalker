import { Friend } from "../entities/Friend";
import { checkFriendList, compareFriends, connectorStatus } from "../LCU/lcu";
import { addRanking, getFriendsAndLastRankingFromDb } from "../routes/friends";
import { addNotification } from "../routes/notifications";
import { getRankDifference, sendToClient } from "../utils";

export const friendsRef = {
    current: null as any,
};

export const startCheckFriendListJob = async () => {
    try {
        if (!connectorStatus.current) throw "not connected to LCU";
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
                        const friend = new Friend();
                        friend.puuid = change.puuid;
                        await addNotification({ ...notification, friend });
                    }
                }
                sendToClient("invalidate", "notifications/nb-new");
            } else {
                console.log("no soloQ played by friends");
            }

            friendsRef.current = friendListStats;

            await new Promise((resolve) => setTimeout(resolve, 10000));
        }
    } catch (e) {
        console.log(e);
        console.log("Retrying in 5s...");
        setTimeout(() => startCheckFriendListJob(), 5000);
    }
};
