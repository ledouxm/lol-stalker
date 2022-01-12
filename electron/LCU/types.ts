export interface FriendDto {
    availability: string;
    displayGroupId: number;
    displayGroupName: string;
    gameName: string;
    gameTag: string;
    groupId: number;
    groupName: string;
    icon: number;
    id: string;
    isP2PConversationMuted: boolean;
    lastSeenOnlineTimestamp?: any;
    name: string;
    note: string;
    patchline: string;
    pid: string;
    platformId: string;
    product: string;
    productName: string;
    puuid: string;
    statusMessage: string;
    summary: string;
    summonerId: number;
    time: number;
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

export interface Friend {
    puuid: string;
    id: string;
    gameName: string;
    gameTag: string;
    name: string;
    summonerId: number;
    icon: number;
}
