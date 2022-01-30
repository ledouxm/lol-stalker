import { pick } from "@pastable/core";
import debug from "debug";
import { prisma } from "../db";
import { Prisma } from "../prismaClient";
import { editSelectedFriends, persistSelectedFriends, selectedFriends } from "../selection";
import { formatRank } from "../utils";

const friendFields: (keyof Omit<Prisma.FriendCreateInput, "oldNames" | "notifications">)[] = [
    "gameName",
    "gameTag",
    "icon",
    "id",
    "name",
    "puuid",
    "summonerId",
    "groupId",
    "groupName",
];
export const rankingFields: (keyof Omit<Prisma.RankingCreateInput, "friend">)[] = [
    "division",
    "tier",
    "leaguePoints",
    "wins",
    "losses",
    "miniSeriesProgress",
];

export const getFriendsFromDb = () =>
    prisma.friend.findMany({ where: { isCurrentSummoner: { equals: false } } });

export const getFriendsAndRankingsFromDb = () =>
    prisma.friend.findMany({
        where: { isCurrentSummoner: { equals: false } },
        include: { ranks: true },
    });

export const getFriendAndRankingsFromDb = (puuid: Prisma.FriendCreateInput["puuid"]) =>
    prisma.friend.findUnique({
        where: { puuid },
        include: {
            ranks: { orderBy: { createdAt: "desc" } },
            oldNames: { orderBy: { createdAt: "desc" } },
        },
    });

export const getFriendsAndLastRankingFromDb = async () => {
    const friends = await getFriendsAndRankingsFromDb();
    return friends.map((friend) => {
        const lastRank = friend.ranks.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )[0];
        return {
            ...pick(friend, friendFields),
            ...(lastRank ? pick(lastRank, rankingFields) : {}),
        };
    });
};

export const getSelectedFriends = async () => Array.from(selectedFriends.current!);
export const toggleSelectFriends = async (
    puuids: Prisma.FriendCreateInput["puuid"][],
    newState: boolean
) =>
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

export const addOrUpdateFriends = async (friends: Prisma.FriendCreateInput[]) => {
    const existingFriends = await getFriendsFromDb();

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
                    await prisma.friendName.create({
                        data: {
                            puuid: friendDto.puuid,
                            name: existingFriend.name,
                        },
                    });
                }

                await prisma.friend.update({
                    where: { puuid: friend.puuid },
                    data: friendDto,
                });
            }
        } else {
            await prisma.friend.create({
                data: friendDto,
            });
            selectedFriends.current?.add(friendDto.puuid);
        }
    }
    await persistSelectedFriends();
    debug("add or update ended");
};
export const addRanking = async (
    ranking: Omit<Prisma.RankingCreateInput, "friend" | "oldNames">,
    puuid: Prisma.FriendCreateInput["puuid"]
) => {
    return prisma.ranking.create({
        data: {
            ...pick(ranking, rankingFields),
            puuid,
        },
    });
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
