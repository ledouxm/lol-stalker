import { pick } from "@pastable/core";
import debug from "debug";
import { getManager } from "typeorm";
import { sendFriendList, sendInvalidate } from ".";
import { Friend } from "../../entities/Friend";
import { FriendName } from "../../entities/FriendName";
import { Ranking } from "../../entities/Ranking";
import { FriendDto } from "../lcu/types";
import { editStoreEntry, store } from "../store";

const friendFields: (keyof FriendDto)[] = [
    "gameName",
    "gameTag",
    "icon",
    "id",
    "name",
    "puuid",
    "summonerId",
    "groupId",
    "groupName",
    "isCurrentSummoner",
];
export const rankingFields: (keyof Ranking)[] = [
    "division",
    "tier",
    "leaguePoints",
    "wins",
    "losses",
    "miniSeriesProgress",
];

export const getFriendsFromDb = () => {
    const manager = getManager();
    return manager.find(Friend, { where: { isCurrentSummoner: false } });
};

export const getFriendsAndRankingsFromDb = () => {
    const manager = getManager();
    return manager.find(Friend, {
        relations: ["rankings"],
        where: { isCurrentSummoner: false },
    });
};

export const getFriendAndRankingsFromDb = (puuid: Friend["puuid"]) =>
    getManager()
        .createQueryBuilder(Friend, "friend")
        .leftJoinAndSelect("friend.rankings", "rankings")
        .leftJoinAndSelect("friend.friendNames", "friendNames")
        .leftJoinAndSelect("friend.notifications", "notifications")
        .orderBy("rankings.createdAt", "DESC")
        .orderBy("notifications.createdAt", "DESC")
        .orderBy("friendNames.createdAt", "DESC")
        .where("friend.puuid = :puuid", { puuid })
        .getOne();

export const getFriendsAndLastRankingFromDb = async () => {
    const friends = await getFriendsAndRankingsFromDb();
    return friends.map((friend) => {
        const lastRank = friend.rankings.sort(
            //@ts-ignore
            (a, b) => b.createdAt - a.createdAt
        )[0];
        return {
            ...pick(friend, friendFields as any),
            ...(lastRank ? pick(lastRank, rankingFields) : {}),
        };
    });
};

export const toggleSelectFriends = async (puuids: Friend["puuid"][], newState: boolean) => {
    const newSelectedFriends = new Set(store.selectedFriends);

    puuids.forEach((puuid) => newSelectedFriends?.[newState ? "add" : "delete"](puuid));
    await editStoreEntry("selectedFriends", newSelectedFriends);
};

export const selectAllFriends = async (select: boolean) => {
    const friends = await getFriendsFromDb();
    const newSelectedFriends = new Set(store.selectedFriends);

    friends.forEach((friend) => newSelectedFriends?.[select ? "add" : "delete"](friend.puuid));
    await editStoreEntry("selectedFriends", newSelectedFriends);
};

const friendDtoToFriend = (friendDto: FriendDto): Partial<Friend> => ({
    isCurrentSummoner: false,
    ...pick(friendDto, [
        "puuid",
        "id",
        "gameName",
        "gameTag",
        "groupId",
        "groupName",
        "name",
        "summonerId",
        "icon",
    ]),
});

export const addOrUpdateFriends = async (friends: FriendDto[]) => {
    const existingFriends = await getFriendsFromDb();
    const manager = getManager();

    const currentInGame = [];

    for (const friend of friends) {
        if (
            !["outOfGame", "hosting_RANKED_SOLO_5x5"].includes(friend.lol.gameStatus) &&
            friend.lol.gameQueueType === "RANKED_SOLO_5x5"
        ) {
            currentInGame.push({
                ...pick(friend, ["puuid", "gameName", "icon", "name"]),
                ...pick(friend.lol, ["championId", "timeStamp", "gameStatus"]),
            });
        }
        const friendDto = pick(friend, friendFields);
        const existingFriend = existingFriends.find((ef) => ef.puuid === friend.puuid);
        if (existingFriend) {
            if (
                friendDto.gameName !== existingFriend.gameName ||
                friendDto.groupId !== existingFriend.groupId ||
                friendDto.groupName !== existingFriend.groupName
            ) {
                if (friendDto.gameName !== existingFriend.gameName) {
                    await manager.save(
                        manager.create(FriendName, {
                            name: existingFriend.gameName,
                            friend: { puuid: friend.puuid },
                        })
                    );
                }

                await manager.update(
                    Friend,
                    { puuid: friend.puuid },
                    { ...friendDtoToFriend(friendDto) }
                );
            }
        } else {
            await manager.save(manager.create(Friend, friendDtoToFriend(friendDto)));
        }
    }

    await editStoreEntry("inGameFriends", [...currentInGame]);
    sendInvalidate("friendList/in-game");
    sendFriendList();
    debug("add or update ended");
};
export const addRanking = async (ranking: Ranking, puuid: Friend["puuid"]) => {
    const manager = getManager();
    const friend = new Friend();
    friend.puuid = puuid;
    const payload = { ...pick(ranking, rankingFields), friend };

    const newRanking = manager.create(Ranking, payload);

    return manager.save(newRanking);
};

export const friendsApi = {
    getFriendsFromDb,
    getFriendsAndRankingsFromDb,
    getFriendAndRankingsFromDb,
    getFriendsAndLastRankingFromDb,
    toggleSelectFriends,
    addOrUpdateFriends,
    addRanking,
};
