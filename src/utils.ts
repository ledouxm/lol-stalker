import { RankDto } from "./types";

export const sendMessage = window.ipcRenderer.send;

const timeoutDelay = 5000;
export function electronRequest<T = any>(event: string, data?: any) {
    return new Promise<T>((resolve, reject) => {
        const timeout = setTimeout(reject, timeoutDelay);
        window.Main.on(event, (data: any) => {
            clearTimeout(timeout);
            if (!data) reject(404);
            resolve(data);
        });
        window.ipcRenderer.send(event, data);
    });
}

const tiers = [
    "IRON",
    "SILVER",
    "GOLD",
    "PLATINUM",
    "DIAMOND",
    "MASTER",
    "GRANDMASTER",
    "CHALLENGER",
];
const divisions = ["IV", "III", "II", "I"];
export type MinimalRank = Pick<RankDto, "division" | "tier" | "leaguePoints">;
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
