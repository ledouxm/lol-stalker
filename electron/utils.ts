import { Prisma } from "@prisma/client";
import debug from "debug";

export const makeDebug = (suffix: string) => debug("lol-stalking").extend(suffix);
export const formatRank = (
    ranking: Pick<Prisma.RankingCreateInput, "division" | "tier" | "leaguePoints">
) => `${ranking.tier} ${ranking.division} - ${ranking.leaguePoints}`;
