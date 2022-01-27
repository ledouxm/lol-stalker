import { addRanking, getFriendsAndLastRankingFromDb, getSelectedFriends } from "../routes/friends";
import { addNotification } from "../routes/notifications";
import { getRankDifference, sendToClient } from "../utils";
import { connectorStatus, checkFriendList, compareFriends, FriendChange } from "../LCU/lcu";

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
                const selectedFriends = await getSelectedFriends();

                const toNotify: FriendChange[] = [];
                console.log(
                    `${changes.length} change${changes.length > 1 ? "s" : ""} found in friendList`
                );
                for (const change of changes) {
                    await addRanking(change, change.puuid);
                    const notification = getRankDifference(change.oldFriend as any, change as any);
                    await addNotification({ ...notification, puuid: change.puuid });
                    if (selectedFriends.find((friend) => friend.puuid === change.puuid))
                        toNotify.push(change);
                }
                // sendToClient("friendList/changes", toNotify);
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
