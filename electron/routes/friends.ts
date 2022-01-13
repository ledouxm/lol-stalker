import { prisma } from "../db";
import { Prisma } from "@prisma/client";
import { formatRank, makeDebug } from "../utils";
import debug from "debug";
import { pick } from "@pastable/core";

const friendDebug = makeDebug("prisma/friend");
const rankingDebug = makeDebug("prisma/ranking");

const friendFields: (keyof Omit<Prisma.FriendCreateInput, "oldNames">)[] = [
    "gameName",
    "gameTag",
    "icon",
    "id",
    "name",
    "puuid",
    "summonerId",
    "groupId",
    "groupName",
    "selected",
];
const rankingFields: (keyof Omit<Prisma.RankingCreateInput, "friend">)[] = [
    "division",
    "tier",
    "leaguePoints",
    "wins",
    "losses",
    "miniSeriesProgress",
];

export const getFriendsFromDb = () => prisma.friend.findMany();

export const getFriendsAndRankingsFromDb = () =>
    prisma.friend.findMany({ include: { ranks: true } });

export const getFriendAndRankingsFromDb = (puuid: Prisma.FriendCreateInput["puuid"]) =>
    prisma.friend.findUnique({ where: { puuid }, include: { ranks: true } });

export const getFriendsAndLastRankingFromDb = async () => {
    const friends = await getFriendsAndRankingsFromDb();
    return friends.map((friend) => {
        const lastRank = friend.ranks.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )[0];
        return {
            ...pick(friend, friendFields),
            ...pick(lastRank, rankingFields),
        };
    });
};

export const toggleSelectFriends = async (
    puuids: Prisma.FriendCreateInput["puuid"][],
    newState: boolean
) => prisma.friend.updateMany({ where: { puuid: { in: puuids } }, data: { selected: newState } });

export const addOrUpdateFriends = async (friends: Prisma.FriendCreateInput[]) => {
    const existingFriends = await getFriendsFromDb();

    for (const friend of friends) {
        const friendDto = pick(friend, friendFields);
        const existingFriend = existingFriends.find((ef) => ef.puuid === friend.puuid);
        if (existingFriend) {
            if (
                friendDto.gameName !== existingFriend.gameName ||
                friendDto.groupId !== existingFriend.groupId ||
                friendDto.groupName !== existingFriend.groupName ||
                friendDto.selected !== existingFriend.selected
            ) {
                if (friendDto.gameName !== existingFriend.gameName) {
                    await prisma.friendName.create({
                        data: {
                            puuid: friendDto.puuid,
                            name: existingFriend.name,
                        },
                    });
                }

                friendDebug(`update friend ${existingFriend.name}`);
                await prisma.friend.update({
                    where: { puuid: friend.puuid },
                    data: friendDto,
                });
            }
        } else {
            friendDebug(`create friend ${friend.name}`);
            await prisma.friend.create({
                data: friendDto,
            });
        }
    }

    debug("add or update ended");
};
export const addRanking = async (
    ranking: Omit<Prisma.RankingCreateInput, "friend" | "oldNames">,
    puuid: Prisma.FriendCreateInput["puuid"],
    name?: Prisma.FriendCreateInput["name"]
) => {
    rankingDebug(`create ranking for friend ${name || puuid}: ${formatRank(ranking)}`);
    return prisma.ranking.create({
        data: {
            ...pick(ranking, rankingFields),
            puuid,
        },
    });
};
