import debug from "debug";
import { BrowserWindow } from "electron";
import electronIsDev from "electron-is-dev";
import path from "path";
import { Ranking } from "./entities/Ranking";

const domain = electronIsDev ? "localhost:8080/" : "stalker.back.chainbreak.dev/";
export const baseURL = (electronIsDev ? "http://" : "https://") + domain;
export const wsUrl = "ws://" + domain + "ws";

export const sendToClient = (channel: string, ...args: any[]) =>
    console.log(channel)! || BrowserWindow.getAllWindows()?.[0]?.webContents.send(channel, ...args);

export const makeDataDragonUrl = (buildVersion: string) =>
    `https://ddragon.leagueoflegends.com/cdn/dragontail-${buildVersion}.tgz`;

export const formatRank = (ranking: Pick<Ranking, "division" | "tier" | "leaguePoints">) =>
    `${ranking.tier}${ranking.division !== "NA" ? ` ${ranking.division}` : ""} - ${
        ranking.leaguePoints
    } LPs`;

export const ranks: Rank[] = [
    {
        tier: "IRON",
        division: "IV",
        leaguePoints: 0,
    },
    {
        tier: "IRON",
        division: "II",
        leaguePoints: 50,
    },
    {
        tier: "IRON",
        division: "II",
        leaguePoints: 30,
    },
    {
        tier: "SILVER",
        division: "III",
        leaguePoints: 30,
    },
    {
        tier: "CHALLENGER",
        division: "I",
        leaguePoints: 10,
    },
    {
        tier: "CHALLENGER",
        division: "I",
        leaguePoints: 100,
    },
];
export type Tier =
    | "IRON"
    | "SILVER"
    | "GOLD"
    | "PLATINUM"
    | "DIAMOND"
    | "MASTER"
    | "GRANDMASTER"
    | "CHALLENGER";
type Division = "I" | "II" | "III" | "IV";
interface Rank {
    tier: string;
    division: string;
    leaguePoints: number;
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
const divisions = ["IV", "III", "II", "I"];
export const getRankDifference = (oldRank: Rank, newRank: Rank) => {
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

        return {
            type: hasPromoted ? "PROMOTION" : "DEMOTION",
            from: formatRank(oldRank),
            to: formatRank(newRank),
            content: `${hasPromoted ? "PROMOTED" : "DEMOTED"} FROM ${oldRank.tier} ${
                oldRank.division
            } TO ${newRank.tier} ${newRank.division}`,
        };
    }

    const lpDifference = oldRank.leaguePoints - newRank.leaguePoints;
    const hasLost = lpDifference > 0;
    return {
        type: hasLost ? "LOSS" : "WIN",
        from: formatRank(oldRank),
        to: formatRank(newRank),
        content: `${hasLost ? "LOST" : "GAINED"} ${Math.abs(lpDifference)} LP`,
    };
};

export const getDbPath = () =>
    path.join(
        process.env.APPDATA!,
        "LoL Stalker",
        "database",
        electronIsDev ? "lol-stalker.dev.db" : "lol-stalker.db"
    );
