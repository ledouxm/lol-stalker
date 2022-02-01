import { pick } from "@pastable/core";
import debug from "debug";
import { getManager } from "typeorm";
import { sendFriendList, sendInvalidate } from ".";
import { Friend } from "../entities/Friend";
import { FriendName } from "../entities/FriendName";
import { Ranking } from "../entities/Ranking";
import { FriendDto } from "../LCU/types";
import { editSelectedFriends, persistSelectedFriends, selectedFriends } from "../selection";
import { sendToClient } from "../utils";

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
    getManager().findOne(Friend, {
        where: { puuid },
        relations: ["rankings", "friendNames", "notifications"],
    });
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

export const getSelectedFriends = async () => Array.from(selectedFriends.current!);
export const toggleSelectFriends = async (puuids: Friend["puuid"][], newState: boolean) =>
    editSelectedFriends(() =>
        puuids.forEach((puuid) => selectedFriends.current?.[newState ? "add" : "delete"](puuid))
    );
export const selectAllFriends = async (select: boolean) => {
    const friends = await getFriendsFromDb();
    return editSelectedFriends(() =>
        friends.forEach((friend) =>
            selectedFriends.current?.[select ? "add" : "delete"](friend.puuid)
        )
    );
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

export const inGameFriends: { current: any[] } = {
    current: null as any,
};

export const addOrUpdateFriends = async (friends: FriendDto[]) => {
    const existingFriends = await getFriendsFromDb();
    const manager = getManager();

    const currentInGame = [];

    for (const friend of friends) {
        if (
            friend.lol.gameStatus !== "outOfGame" &&
            friend.lol.gameQueueType === "RANKED_SOLO_5x5"
        ) {
            currentInGame.push({
                ...pick(friend, ["puuid", "gameName", "icon"]),
                ...pick(friend.lol, ["championId", "timeStamp", "gameStatus"]),
            }); // championId: friend.lol.championId});
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
    inGameFriends.current = [...currentInGame];
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
    getSelectedFriends,
    toggleSelectFriends,
    addOrUpdateFriends,
    addRanking,
};
