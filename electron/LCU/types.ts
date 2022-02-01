import { Friend } from "../entities/Friend";

export interface FriendDto extends Friend {
    availability: string;
    displayGroupId: number;
    displayGroupName: string;
    groupId: number;
    groupName: string;
    isP2PConversationMuted: boolean;
    lastSeenOnlineTimestamp?: any;
    name: string;
    note: string;
    patchline: string;
    pid: string;
    platformId: string;
    product: string;
    productName: string;
    statusMessage: string;
    summary: string;
    time: number;
    lol: any;
}

export interface RerollPoints {
    currentPoints: number;
    maxRolls: number;
    numberOfRolls: number;
    pointsCostToRoll: number;
    pointsToReroll: number;
}

export interface CurrentSummoner {
    accountId: number;
    displayName: string;
    internalName: string;
    nameChangeFlag: boolean;
    percentCompleteForNextLevel: number;
    privacy: string;
    profileIconId: number;
    puuid: string;
    rerollPoints: RerollPoints;
    summonerId: number;
    summonerLevel: number;
    unnamed: boolean;
    xpSinceLastLevel: number;
    xpUntilNextLevel: number;
}

export interface HighestRankedEntry {
    division: string;
    isProvisional: boolean;
    leaguePoints: number;
    losses: number;
    miniSeriesProgress: string;
    previousSeasonAchievedDivision: string;
    previousSeasonAchievedTier: string;
    previousSeasonEndDivision: string;
    previousSeasonEndTier: string;
    provisionalGameThreshold: number;
    provisionalGamesRemaining: number;
    queueType: string;
    ratedRating: number;
    ratedTier: string;
    tier: string;
    warnings?: any;
    wins: number;
}

export interface HighestRankedEntrySR {
    division: string;
    isProvisional: boolean;
    leaguePoints: number;
    losses: number;
    miniSeriesProgress: string;
    previousSeasonAchievedDivision: string;
    previousSeasonAchievedTier: string;
    previousSeasonEndDivision: string;
    previousSeasonEndTier: string;
    provisionalGameThreshold: number;
    provisionalGamesRemaining: number;
    queueType: string;
    ratedRating: number;
    ratedTier: string;
    tier: string;
    warnings?: any;
    wins: number;
}

export interface RANKEDFLEXSR {
    division: string;
    isProvisional: boolean;
    leaguePoints: number;
    losses: number;
    miniSeriesProgress: string;
    previousSeasonAchievedDivision: string;
    previousSeasonAchievedTier: string;
    previousSeasonEndDivision: string;
    previousSeasonEndTier: string;
    provisionalGameThreshold: number;
    provisionalGamesRemaining: number;
    queueType: string;
    ratedRating: number;
    ratedTier: string;
    tier: string;
    warnings?: any;
    wins: number;
}

export interface RANKEDSOLO5x5 {
    division: string;
    isProvisional: boolean;
    leaguePoints: number;
    losses: number;
    miniSeriesProgress: string;
    previousSeasonAchievedDivision: string;
    previousSeasonAchievedTier: string;
    previousSeasonEndDivision: string;
    previousSeasonEndTier: string;
    provisionalGameThreshold: number;
    provisionalGamesRemaining: number;
    queueType: string;
    ratedRating: number;
    ratedTier: string;
    tier: string;
    warnings?: any;
    wins: number;
}

export interface RANKEDTFT {
    division: string;
    isProvisional: boolean;
    leaguePoints: number;
    losses: number;
    miniSeriesProgress: string;
    previousSeasonAchievedDivision: string;
    previousSeasonAchievedTier: string;
    previousSeasonEndDivision: string;
    previousSeasonEndTier: string;
    provisionalGameThreshold: number;
    provisionalGamesRemaining: number;
    queueType: string;
    ratedRating: number;
    ratedTier: string;
    tier: string;
    warnings?: any;
    wins: number;
}

export interface RANKEDTFTPAIRS {
    division: string;
    isProvisional: boolean;
    leaguePoints: number;
    losses: number;
    miniSeriesProgress: string;
    previousSeasonAchievedDivision: string;
    previousSeasonAchievedTier: string;
    previousSeasonEndDivision: string;
    previousSeasonEndTier: string;
    provisionalGameThreshold: number;
    provisionalGamesRemaining: number;
    queueType: string;
    ratedRating: number;
    ratedTier: string;
    tier: string;
    warnings?: any;
    wins: number;
}

export interface RANKEDTFTTURBO {
    division: string;
    isProvisional: boolean;
    leaguePoints: number;
    losses: number;
    miniSeriesProgress: string;
    previousSeasonAchievedDivision: string;
    previousSeasonAchievedTier: string;
    previousSeasonEndDivision: string;
    previousSeasonEndTier: string;
    provisionalGameThreshold: number;
    provisionalGamesRemaining: number;
    queueType: string;
    ratedRating: number;
    ratedTier: string;
    tier: string;
    warnings?: any;
    wins: number;
}

export interface QueueMap {
    RANKED_FLEX_SR: RANKEDFLEXSR;
    RANKED_SOLO_5x5: RANKEDSOLO5x5;
    RANKED_TFT: RANKEDTFT;
    RANKED_TFT_PAIRS: RANKEDTFTPAIRS;
    RANKED_TFT_TURBO: RANKEDTFTTURBO;
}

export interface Queue {
    division: string;
    isProvisional: boolean;
    leaguePoints: number;
    losses: number;
    miniSeriesProgress: string;
    previousSeasonAchievedDivision: string;
    previousSeasonAchievedTier: string;
    previousSeasonEndDivision: string;
    previousSeasonEndTier: string;
    provisionalGameThreshold: number;
    provisionalGamesRemaining: number;
    queueType: string;
    ratedRating: number;
    ratedTier: string;
    tier: string;
    warnings?: any;
    wins: number;
}

export interface RANKEDFLEXSR2 {
    currentSeasonEnd: number;
    currentSeasonId: number;
    nextSeasonStart: number;
}

export interface RANKEDSOLO5x52 {
    currentSeasonEnd: number;
    currentSeasonId: number;
    nextSeasonStart: number;
}

export interface RANKEDTFT2 {
    currentSeasonEnd: number;
    currentSeasonId: number;
    nextSeasonStart: number;
}

export interface RANKEDTFTPAIRS2 {
    currentSeasonEnd: number;
    currentSeasonId: number;
    nextSeasonStart: number;
}

export interface RANKEDTFTTURBO2 {
    currentSeasonEnd: number;
    currentSeasonId: number;
    nextSeasonStart: number;
}

export interface Seasons {
    RANKED_FLEX_SR: RANKEDFLEXSR2;
    RANKED_SOLO_5x5: RANKEDSOLO5x52;
    RANKED_TFT: RANKEDTFT2;
    RANKED_TFT_PAIRS: RANKEDTFTPAIRS2;
    RANKED_TFT_TURBO: RANKEDTFTTURBO2;
}

export interface SplitsProgress {
    1: number;
}

export interface RankedStats {
    earnedRegaliaRewardIds: any[];
    highestPreviousSeasonAchievedDivision: string;
    highestPreviousSeasonAchievedTier: string;
    highestPreviousSeasonEndDivision: string;
    highestPreviousSeasonEndTier: string;
    highestRankedEntry: HighestRankedEntry;
    highestRankedEntrySR: HighestRankedEntrySR;
    queueMap: QueueMap;
    queues: Queue[];
    rankedRegaliaLevel: number;
    seasons: Seasons;
    splitsProgress: SplitsProgress;
}

export interface Player {
    accountId: number;
    currentAccountId: number;
    currentPlatformId: string;
    matchHistoryUri: string;
    platformId: string;
    profileIcon: number;
    summonerId: number;
    summonerName: string;
}

export interface ParticipantIdentity {
    participantId: number;
    player: Player;
}

export interface Stats {
    assists: number;
    causedEarlySurrender: boolean;
    champLevel: number;
    combatPlayerScore: number;
    damageDealtToObjectives: number;
    damageDealtToTurrets: number;
    damageSelfMitigated: number;
    deaths: number;
    doubleKills: number;
    earlySurrenderAccomplice: boolean;
    firstBloodAssist: boolean;
    firstBloodKill: boolean;
    firstInhibitorAssist: boolean;
    firstInhibitorKill: boolean;
    firstTowerAssist: boolean;
    firstTowerKill: boolean;
    gameEndedInEarlySurrender: boolean;
    gameEndedInSurrender: boolean;
    goldEarned: number;
    goldSpent: number;
    inhibitorKills: number;
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
    item6: number;
    killingSprees: number;
    kills: number;
    largestCriticalStrike: number;
    largestKillingSpree: number;
    largestMultiKill: number;
    longestTimeSpentLiving: number;
    magicDamageDealt: number;
    magicDamageDealtToChampions: number;
    magicalDamageTaken: number;
    neutralMinionsKilled: number;
    neutralMinionsKilledEnemyJungle: number;
    neutralMinionsKilledTeamJungle: number;
    objectivePlayerScore: number;
    participantId: number;
    pentaKills: number;
    perk0: number;
    perk0Var1: number;
    perk0Var2: number;
    perk0Var3: number;
    perk1: number;
    perk1Var1: number;
    perk1Var2: number;
    perk1Var3: number;
    perk2: number;
    perk2Var1: number;
    perk2Var2: number;
    perk2Var3: number;
    perk3: number;
    perk3Var1: number;
    perk3Var2: number;
    perk3Var3: number;
    perk4: number;
    perk4Var1: number;
    perk4Var2: number;
    perk4Var3: number;
    perk5: number;
    perk5Var1: number;
    perk5Var2: number;
    perk5Var3: number;
    perkPrimaryStyle: number;
    perkSubStyle: number;
    physicalDamageDealt: number;
    physicalDamageDealtToChampions: number;
    physicalDamageTaken: number;
    playerScore0: number;
    playerScore1: number;
    playerScore2: number;
    playerScore3: number;
    playerScore4: number;
    playerScore5: number;
    playerScore6: number;
    playerScore7: number;
    playerScore8: number;
    playerScore9: number;
    quadraKills: number;
    sightWardsBoughtInGame: number;
    teamEarlySurrendered: boolean;
    timeCCingOthers: number;
    totalDamageDealt: number;
    totalDamageDealtToChampions: number;
    totalDamageTaken: number;
    totalHeal: number;
    totalMinionsKilled: number;
    totalPlayerScore: number;
    totalScoreRank: number;
    totalTimeCrowdControlDealt: number;
    totalUnitsHealed: number;
    tripleKills: number;
    trueDamageDealt: number;
    trueDamageDealtToChampions: number;
    trueDamageTaken: number;
    turretKills: number;
    unrealKills: number;
    visionScore: number;
    visionWardsBoughtInGame: number;
    wardsKilled: number;
    wardsPlaced: number;
    win: boolean;
}

export interface CreepsPerMinDeltas {}

export interface CsDiffPerMinDeltas {}

export interface DamageTakenDiffPerMinDeltas {}

export interface DamageTakenPerMinDeltas {}

export interface GoldPerMinDeltas {}

export interface XpDiffPerMinDeltas {}

export interface XpPerMinDeltas {}

export interface Timeline {
    creepsPerMinDeltas: CreepsPerMinDeltas;
    csDiffPerMinDeltas: CsDiffPerMinDeltas;
    damageTakenDiffPerMinDeltas: DamageTakenDiffPerMinDeltas;
    damageTakenPerMinDeltas: DamageTakenPerMinDeltas;
    goldPerMinDeltas: GoldPerMinDeltas;
    lane: string;
    participantId: number;
    role: string;
    xpDiffPerMinDeltas: XpDiffPerMinDeltas;
    xpPerMinDeltas: XpPerMinDeltas;
}

export interface Participant {
    championId: number;
    highestAchievedSeasonTier: string;
    participantId: number;
    spell1Id: number;
    spell2Id: number;
    stats: Stats;
    teamId: number;
    timeline: Timeline;
}

export interface Ban {
    championId: number;
    pickTurn: number;
}

export interface Team {
    bans: Ban[];
    baronKills: number;
    dominionVictoryScore: number;
    dragonKills: number;
    firstBaron: boolean;
    firstBlood: boolean;
    firstDargon: boolean;
    firstInhibitor: boolean;
    firstTower: boolean;
    inhibitorKills: number;
    riftHeraldKills: number;
    teamId: number;
    towerKills: number;
    vilemawKills: number;
    win: string;
}

export interface Game {
    gameCreation: any;
    gameCreationDate: Date;
    gameDuration: number;
    gameId: any;
    gameMode: string;
    gameType: string;
    gameVersion: string;
    mapId: number;
    participantIdentities: ParticipantIdentity[];
    participants: Participant[];
    platformId: string;
    queueId: number;
    seasonId: number;
    teams: Team[];
}

export interface Games {
    gameBeginDate: string;
    gameCount: number;
    gameEndDate: string;
    gameIndexBegin: number;
    gameIndexEnd: number;
    games: Game[];
}

export interface MatchDto {
    accountId: number;
    games: Games;
    platformId: string;
}
