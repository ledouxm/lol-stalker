import { FriendDto } from "../../types";

export const getProfileIconUrl = (patchVersion: string, icon: FriendDto["icon"]) =>
    `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${icon}.png`;
