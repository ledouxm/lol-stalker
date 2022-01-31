import { pick } from "@pastable/core";
import debug from "debug";
import { getManager } from "typeorm";
import { Friend } from "../entities/Friend";
import { FriendName } from "../entities/FriendName";
import { Ranking } from "../entities/Ranking";
import { FriendDto } from "../LCU/types";
import { editSelectedFriends, persistSelectedFriends, selectedFriends } from "../selection";

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

const friendDtoToFriend = (friendDto: FriendDto): Friend => {
    return getManager().create(Friend, {
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
};

export const addOrUpdateFriends = async (friends: FriendDto[]) => {
    const existingFriends = await getFriendsFromDb();
    const manager = getManager();
    for (const friend of friends) {
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
                        //@ts-ignore
                        manager.create(FriendName, {
                            name: existingFriend.gameName,
                            friend: friendDto.puuid,
                        })
                    );
                }

                await manager.update(
                    Friend,
                    { friend: friend.puuid },
                    { ...friendDtoToFriend(friendDto) }
                );
            }
        } else {
            await manager.save(friendDtoToFriend(friendDto));
            selectedFriends.current?.add(friendDto.puuid);
        }
    }
    await persistSelectedFriends();
    debug("add or update ended");
};
export const addRanking = async (ranking: Ranking, puuid: Friend["puuid"]) => {
    return getManager().save(
        //@ts-ignore
        getManager().create(Ranking, { ...pick(ranking, rankingFields), friend: puuid })
    );
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
