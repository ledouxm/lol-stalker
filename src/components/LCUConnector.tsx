import axios from "axios";
import { atom } from "jotai";
import { atomWithStorage, useUpdateAtom } from "jotai/utils";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useChampionsList } from "../features/DataDragon/useChampionsList";
import { useItemsList } from "../features/DataDragon/useItemsList";
import { useSummonerSpellsList } from "../features/DataDragon/useSummonerSpellsList";
import { friendsAtom, selectedFriendsAtom } from "../features/FriendList/useFriendList";
import { AuthData, FriendDto } from "../types";
import { electronRequest, sendMessage } from "../utils";

export const lcuStatusAtom = atom<AuthData>(null as unknown as AuthData);

export enum LocalStorageKeys {
    OpenGroups = "lol-stalking/openGroups",
}

export const openGroupsAtom = atomWithStorage<number[]>(LocalStorageKeys.OpenGroups, []);

const getLCUStatus = () => electronRequest<AuthData>("lcu/connection");

export const LCUConnector = () => {
    const setFriends = useUpdateAtom(friendsAtom);
    const setSelectedFriends = useUpdateAtom(selectedFriendsAtom);
    const setLcuStatus = useUpdateAtom(lcuStatusAtom);
    const queryClient = useQueryClient();

    useQuery("lcuStatus", getLCUStatus, { onSuccess: setLcuStatus });
    usePatchVersion();
    useChampionsList();
    useItemsList();
    useSummonerSpellsList();

    useEffect(() => {
        window.ipcRenderer.send("lcu/connection");
        window.Main.on("invalidate", (queryName: string) =>
            queryClient.invalidateQueries(queryName)
        );
        window.Main.on("friendList/lastRank", setFriends);
        window.Main.on("friendList/selected", setSelectedFriends);
        sendMessage("friendList/lastRank");
        sendMessage("friendList/selected");

        return () =>
            window.Main.getEventNames().forEach((eventName) =>
                window.Main.off(eventName as string)
            );
    }, []);

    return null;
};

export const patchVersionAtom = atom<string>(null as unknown as string);
export const usePatchVersion = () => {
    const setPatchVersion = useUpdateAtom(patchVersionAtom);
    useQuery("version", getDataDragonVersion, {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60,
        onSuccess: (data) => setPatchVersion(data),
    });
};
export const getDataDragonVersion = async () =>
    (await axios.get("https://ddragon.leagueoflegends.com/api/versions.json")).data[0];

export interface OldFriend {
    division: string;
    tier: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    name: string;
    puuid: string;
}

export interface FriendChange {
    division: string;
    tier: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    name: string;
    puuid: string;
    oldFriend: OldFriend;
}
