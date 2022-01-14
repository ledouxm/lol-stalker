import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { atom, useAtom } from "jotai";
import { atomWithStorage, useUpdateAtom } from "jotai/utils";
import { getRankDifference, sendMessage } from "../utils";
import { friendsAtom, selectedFriendsAtom } from "../features/FriendList/useFriendList";
import { FriendDto } from "../types";
import { useInterval } from "@chakra-ui/react";

export enum LocalStorageKeys {
    OpenGroups = "lol-stalking/openGroups",
}

export const openGroupsAtom = atomWithStorage<number[]>(LocalStorageKeys.OpenGroups, []);

export const LCUConnector = () => {
    const setFriends = useUpdateAtom(friendsAtom);
    const setSelectedFriends = useUpdateAtom(selectedFriendsAtom);

    const queryClient = useQueryClient();
    usePatchVersion();

    useInterval(() => console.log(window.location.pathname), 1000);

    useEffect(() => {
        window.ipcRenderer.send("lcu/connection");
        window.Main.on("invalidate", (queryName: string) =>
            queryClient.invalidateQueries(queryName)
        );
        window.Main.on("friendList/lastRank", setFriends);
        window.Main.on("friendList/selected", (selected: Pick<FriendDto, "puuid" | "selected">[]) =>
            setSelectedFriends(
                selected.filter((friend) => !!friend.selected).map((friend) => friend.puuid)
            )
        );
        // TODO: remove since this is for debug purpose
        // window.Main.on("friendList/changes", (changes: FriendChange[]) => {
        //     const messages = changes.map(
        //         (change) => change.name + ": " + getRankDifference(change.oldFriend, change)
        //         );
        //         console.log(messages);
        //     });
        sendMessage("friendList/lastRank");
        sendMessage("friendList/selected");
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
