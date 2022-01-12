import { prisma } from "../db";
import { Prisma } from "@prisma/client";
import { formatRank, makeDebug } from "../utils";
import debug from "debug";
import { pick } from "@pastable/core";

const friendDebug = makeDebug("prisma/friend");
const rankingDebug = makeDebug("prisma/ranking");

export const getFriendsFromDb = () => prisma.friend.findMany();
export const getFriendsAndRankingFromDb = async () => {
    const friends = await prisma.friend.findMany({ include: { ranks: true } });
    return friends.map((friend) => {
        const lastRank = friend.ranks.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )[0];
        return {
            ...pick(friend, ["name", "puuid"]),
            ...pick(lastRank, ["division", "tier", "leaguePoints", "wins", "losses"]),
        };
    });
};

export const addOrUpdateFriends = async (friends: Prisma.FriendCreateInput[]) => {
    const existingFriends = await getFriendsFromDb();

    for (const friend of friends) {
        const friendDto = pick(friend, [
            "gameName",
            "gameTag",
            "icon",
            "id",
            "name",
            "puuid",
            "summonerId",
        ]);
        const existingFriend = existingFriends.find((ef) => ef.puuid === friend.puuid);
        if (existingFriend) {
            if (friendDto.gameName !== existingFriend.gameName) {
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
    ranking: Omit<Prisma.RankingCreateInput, "friend">,
    puuid: Prisma.FriendCreateInput["puuid"],
    name?: Prisma.FriendCreateInput["name"]
) => {
    rankingDebug(`create ranking for friend ${name || puuid}: ${formatRank(ranking)}`);
    return prisma.ranking.create({
        data: { ...pick(ranking, ["division", "leaguePoints", "losses", "tier", "wins"]), puuid },
    });
};
