import { pick } from "@pastable/core";
import { atom, useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { FriendGroup, FriendLastRankDto } from "../../types";
import { sendMessage } from "../../utils";

export const friendsAtom = atom<FriendLastRankDto[]>([]);
export const groupsAtom = atom((get) => getFriendListFilteredByGroups(get(friendsAtom)));

export const useFriendList = () => {
    const [friends, setFriends] = useAtom(friendsAtom);
    const friendGroups = useAtomValue(groupsAtom);
    const queryClient = useQueryClient();

    useEffect(() => {
        window.Main.on("friendList/invalidate", () => queryClient.invalidateQueries("friendList"));
        window.Main.on("friendList/lastRank", setFriends);
        sendMessage("friendList/lastRank");
    }, []);

    return { friends, friendGroups };
};

export const getFriendListFilteredByGroups = (friends: FriendLastRankDto[]) => {
    return friends
        .reduce((groups, friend) => {
            const groupIndex = groups.findIndex((group) => group.groupId === friend.groupId);
            if (groupIndex === -1) {
                groups.push({ ...pick(friend, ["groupId", "groupName"]), friends: [friend] });
            } else groups[groupIndex].friends.push(friend);
            return groups;
        }, [] as FriendGroup[])
        .sort((_, groupB) => (groupB.groupName === "**Default" ? -1 : 1));
};
