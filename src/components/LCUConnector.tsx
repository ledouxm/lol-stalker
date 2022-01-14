import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { atom } from "jotai";
import { atomWithStorage, useUpdateAtom } from "jotai/utils";
import { getRankDifference } from "../utils";

export enum LocalStorageKeys {
    OpenGroups = "lol-stalking/openGroups",
}

export const openGroupsAtom = atomWithStorage<number[]>(LocalStorageKeys.OpenGroups, []);

export const LCUConnector = () => {
    const queryClient = useQueryClient();
    usePatchVersion();
    useEffect(() => {
        window.ipcRenderer.send("lcu/connection");
        window.Main.on("friendList/changes", (changes: FriendChange[]) => {
            // console.log(changes);
            const messages = changes.map(
                (change) => change.name + ": " + getRankDifference(change.oldFriend, change)
            );
            queryClient.invalidateQueries("notifications");
            console.log(messages);
        });
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
