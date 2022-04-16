import { RankDto } from "./types";

export const sendMessage = window.ipcRenderer.send;

const timeoutDelay = 5000;
export const electronMutation = (event: string, data?: any) => window.ipcRenderer.send(event, data);
export function electronRequest<T = any>(event: string, data?: any) {
    return new Promise<T>((resolve, reject) => {
        const timeout = setTimeout(reject, timeoutDelay);
        window.Main.on(event, (data: any) => {
            clearTimeout(timeout);
            resolve(data);
        });
        window.ipcRenderer.send(event, data);
    });
}

const tiers = [
    "IRON",
    "BRONZE",
    "SILVER",
    "GOLD",
    "PLATINUM",
    "DIAMOND",
    "MASTER",
    "GRANDMASTER",
    "CHALLENGER",
];
export type Tier = typeof tiers[0];
const divisions = ["IV", "III", "II", "I"];
export type MinimalRank = Pick<RankDto, "division" | "tier" | "leaguePoints">;
export type LeagueApex = { MASTER: number; GRANDMASTER: number; CHALLENGER: number };
export type TierData = Record<RankDto["tier"], { nbDivision: number; lpMax: number }>;

export const makeTierLps = (apex: LeagueApex): Record<Tier, number> => ({
    IRON: 0,
    BRONZE: 400,
    SILVER: 800,
    GOLD: 1200,
    PLATINUM: 1600,
    DIAMOND: 2000,
    MASTER: 2400,
    GRANDMASTER: 2400 + apex.MASTER,
    CHALLENGER: 2400 + apex.MASTER + apex.GRANDMASTER,
});

export const makeTierData = (apex: LeagueApex) => {
    return {
        ...tiers.reduce(
            (obj, current, index) => ({ ...obj, [current]: { nbDivision: 4, lpMax: 100 } }),
            {}
        ),
        ...Object.entries(apex).reduce(
            (obj, [key, val]) => ({ ...obj, [key]: { nbDivision: 1, lpMax: val } }),
            {}
        ),
    } as TierData;
};

export const getTotalLpFromRank = (rank: RankDto, tierData: TierData) => {
    let totalLp = 0;

    const tierIndex = tiers.findIndex((tier) => tier === rank.tier);
    totalLp += rank.leaguePoints;
    totalLp += tiers
        .filter((_, index) => index < tierIndex)
        .reduce((acc, tier) => acc + tierData[tier].nbDivision * tierData[tier].lpMax, 0);

    if (["MASTER", "GRANDMASTER", "CHALLENGER"].includes(rank.tier)) {
        return totalLp;
    }

    const divisionIndex = divisions.findIndex((division) => division === rank.division);
    totalLp += divisions
        .filter((_, index) => index < divisionIndex)
        .reduce((acc) => acc + tierData[rank.tier].lpMax, 0);

    return totalLp;
};
export const getRankDifference = (oldRank: MinimalRank, newRank: MinimalRank) => {
    const sameTier = oldRank.tier === newRank.tier;
    const sameDivision = oldRank.division === newRank.division;

    const hasDivisionPromoted =
        divisions.findIndex((division) => division === oldRank.division) <
        divisions.findIndex((division) => division === newRank.division);

    if (!sameTier || !sameDivision) {
        const hasTierPromoted =
            tiers.findIndex((tier) => tier === oldRank.tier) <
            tiers.findIndex((tier) => tier === newRank.tier);
        const hasPromoted = hasTierPromoted || (hasDivisionPromoted && sameTier);
        return `${hasPromoted ? "PROMOTED" : "DEMOTED"} FROM ${oldRank.tier} ${
            oldRank.division
        } TO ${newRank.tier} ${newRank.division}`;
    }

    const lpDifference = oldRank.leaguePoints - newRank.leaguePoints;
    return `${lpDifference > 0 ? "LOST" : "GAINED"} ${Math.abs(lpDifference)} LP`;
};
