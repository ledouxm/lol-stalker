import { pick } from "@pastable/core";
import { getManager } from "typeorm";
import { Friend } from "../entities/Friend";
import { Ranking } from "../entities/Ranking";
import { getCurrentSummoner, getSoloQRankedStats } from "../features/lcu/lcu";
import { editStoreEntry, store } from "../features/store";
import { sendWs } from "../features/ws/discord";
import { getRankDifference } from "../utils";

export const startCheckCurrentSummonerRank = async () => {
    try {
        console.log("starting check current summoner");
        const currentSummonerFromLCU = await getCurrentSummoner();
        await editStoreEntry("leagueSummoner", currentSummonerFromLCU);
        const summonerRank = await getSoloQRankedStats(currentSummonerFromLCU.puuid);

        if (!summonerRank) throw "no summoner rank found";
        const manager = getManager();
        const summonerInDb = await manager.findOne(Friend, {
            where: { puuid: currentSummonerFromLCU.puuid },
            relations: ["rankings"],
        });
        // return summonerInDb;
        if (!summonerInDb) {
            const friend = manager.create(Friend, {
                puuid: currentSummonerFromLCU.puuid,
                isCurrentSummoner: true,
                name: currentSummonerFromLCU.displayName,
                gameName: currentSummonerFromLCU.displayName,
                icon: currentSummonerFromLCU.profileIconId,
                summonerId: currentSummonerFromLCU.summonerId,
            });
            await manager.save(friend);
        }
        const lastRanking = summonerInDb?.rankings.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )[0];
        const friend = new Friend();
        friend.puuid = currentSummonerFromLCU.puuid;
        if (
            !lastRanking ||
            lastRanking.division !== summonerRank.division ||
            lastRanking.tier !== summonerRank.tier ||
            lastRanking.leaguePoints !== summonerRank.leaguePoints ||
            lastRanking.miniSeriesProgress !== summonerRank?.miniSeriesProgress
        ) {
            console.log("saving new ranking");
            const ranking = manager.create(Ranking, {
                ...pick(summonerRank!, [
                    "division",
                    "leaguePoints",
                    "tier",
                    "miniSeriesProgress",
                    "wins",
                    "losses",
                ]),
                friend,
            });
            await manager.save(ranking);
            if (lastRanking) {
                const diff = getRankDifference(lastRanking, ranking);
                const payload = {
                    ...diff,
                    puuid: currentSummonerFromLCU.puuid,
                    name: currentSummonerFromLCU.displayName,
                    fromTier: lastRanking.tier,
                    fromDivision: lastRanking.division,
                    fromLeaguePoints: lastRanking.leaguePoints,
                    toTier: ranking.tier,
                    toDivision: ranking.division,
                    toLeaguePoints: ranking.leaguePoints,
                };
                sendWs("update", payload);
            }
        }

        setTimeout(() => startCheckCurrentSummonerRank(), 1000 * 60);
    } catch (e) {
        console.log("something went wrong, retrying in 5s", e);
        setTimeout(() => startCheckCurrentSummonerRank(), 5000);
    }
};
