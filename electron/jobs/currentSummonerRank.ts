import { pick } from "@pastable/core";
import { prisma } from "../db";
import { getCurrentSummoner, getRankedStatsBySummonerPuuid, getSoloQRankedStats } from "../LCU/lcu";
import { Prisma } from "../prismaClient";
import { rankingFields } from "../routes/friends";

export const startCheckCurrentSummonerRank = async () => {
    try {
        const currentSummonerFromLCU = await getCurrentSummoner();
        const currentSummoner: Prisma.FriendCreateInput = {
            puuid: currentSummonerFromLCU.puuid,
            summonerId: currentSummonerFromLCU.summonerId,
            gameName: currentSummonerFromLCU.displayName,
            name: currentSummonerFromLCU.displayName,
            icon: currentSummonerFromLCU.profileIconId,
            isCurrentSummoner: true,
        };
        const currentSummonerInDb = await prisma.friend.findUnique({
            where: { puuid: currentSummoner.puuid },
        });

        if (!currentSummonerInDb) {
            console.log("Creating new current summoner in db");
            await prisma.friend.create({ data: currentSummoner });
        }
        const summonerRank = await getSoloQRankedStats(currentSummoner.puuid);

        console.log(currentSummoner, summonerRank);

        if (!summonerRank) throw `Couldn't find last rank for summoner ${currentSummoner.name}`;

        const lastRankFromDb = await prisma.ranking.findFirst({
            where: { puuid: currentSummoner.puuid },
            orderBy: { createdAt: "desc" },
        });

        if (
            !lastRankFromDb ||
            lastRankFromDb.tier === summonerRank.tier ||
            lastRankFromDb.division === summonerRank.division ||
            lastRankFromDb.leaguePoints === summonerRank.leaguePoints
        ) {
            console.log("Last rank from db is different than the new one, inserting new rank...");
            await prisma.ranking.create({
                data: {
                    ...pick(summonerRank, [
                        "division",
                        "tier",
                        "leaguePoints",
                        "wins",
                        "losses",
                        "miniSeriesProgress",
                    ]),
                    puuid: currentSummoner.puuid,
                },
            });
            console.log("done!");
        } else console.log("No change in current summoner rank");

        setTimeout(() => startCheckCurrentSummonerRank(), 1000 * 60 * 15);
    } catch (e) {
        console.log(e);
        console.log("something went wrong, retrying in 5s");
        setTimeout(() => startCheckCurrentSummonerRank(), 5000);
    }
};
