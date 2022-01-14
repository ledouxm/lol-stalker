import { pick } from "@pastable/core";
import { atom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useEffect } from "react";
import { QueryOptions, useQuery, useQueryClient } from "react-query";
import { electronRequest } from "../../utils";
import { GroupClient } from "./FriendGroup";
import { FriendClient } from "./FriendList";
export const friendsAtom = atom<FriendClient[]>([]);

export const useFriendList = () => {
    const setFriends = useUpdateAtom(friendsAtom);
    const queryClient = useQueryClient();
    useEffect(() => {
        window.Main.on("friendList/invalidate", () => queryClient.invalidateQueries("friendList"));
    }, []);
    return useQuery("friendList", () => getFriendListFilteredByGroups((data) => setFriends(data)));
};

export const getFriendListFilteredByGroups = async (onSuccess?: (data: FriendClient[]) => void) => {
    const friends = await electronRequest<FriendClient[]>("friendList/lastRank");
    onSuccess?.(friends);
    return friends
        .reduce((groups, friend) => {
            const groupIndex = groups.findIndex((group) => group.groupId === friend.groupId);
            if (groupIndex === -1) {
                groups.push({ ...pick(friend, ["groupId", "groupName"]), friends: [friend] });
            } else groups[groupIndex].friends.push(friend);
            return groups;
        }, [] as GroupClient[])
        .sort((_, groupB) => (groupB.groupName === "**Default" ? -1 : 1));
};
