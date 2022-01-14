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
