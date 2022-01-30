export interface FriendDto {
    gameName: string;
    gameTag: string;
    id: number;
    summonerId: number;
    groupId: number;
    groupName: string;
    icon: number;
    name: string;
    puuid: string;
    selected: boolean;
    oldNames: OldNames[];
}
export interface OldNames {
    id: number;
    name: string;
    createdAt: Date;
    puuid: string;
}

export type FriendLastRankDto = FriendDto & Omit<RankDto, "id">;
export type FriendAllRanksDto = FriendDto & { ranks: RankDto[] };
export interface RankDto {
    id: number;
    tier: string;
    wins: number;
    miniSeriesProgress: string;
    losses: number;
    leaguePoints: number;
    division: string;
    puuid: string;
    createdAt: Date;
}

export interface FriendGroup {
    groupId: number;
    groupName: string;
    friends: FriendLastRankDto[];
}

export interface NotificationDto {
    id: number;
    type: string;
    from: string;
    to: string;
    content: string;
    puuid: string;
    createdAt: Date;
    friend: Pick<FriendDto, "icon" | "name">;
    isNew: boolean;
}

export interface AuthData {
    address: string;
    port: number;
    username: string;
    password: string;
    protocol: string;
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
    gameCreationDate: string;
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

export interface Info {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
}

export interface Image {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface Stats {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
}

export interface Champion {
    version: string;
    id: string;
    key: string;
    name: string;
    title: string;
    blurb: string;
    info: Info;
    image: Image;
    tags: string[];
    partype: string;
    stats: Stats;
}

export interface SummonerSpell {
    id: string;
    name: string;
    description: string;
    tooltip: string;
    maxrank: number;
    cooldown: number[];
    cooldownBurn: string;
    cost: number[];
    costBurn: string;
    datavalues: any;
    effect: number[][];
    effectBurn: string[];
    vars: any[];
    key: string;
    summonerLevel: number;
    modes: string[];
    costType: string;
    maxammo: string;
    range: number[];
    rangeBurn: string;
    image: Image;
    resource: string;
}

export interface Item {
    name: string;
    description: string;
    colloq: string;
    plaintext: string;
    from: string[];
    into: string[];
    image: Image;
    gold: any;
    tags: string[];
    maps: any;
    stats: Stats;
    depth: number;
}
