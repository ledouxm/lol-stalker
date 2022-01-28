import { pick } from "@pastable/core";
import { atom } from "jotai";
import { useAtomValue } from "jotai/utils";
import { FriendDto, FriendGroup, FriendLastRankDto } from "../../types";

export const friendsAtom = atom<FriendLastRankDto[]>([]);
export const groupsAtom = atom((get) => getFriendListFilteredByGroups(get(friendsAtom)));
export const selectedFriendsAtom = atom<FriendDto["puuid"][]>([]);
export interface FriendUpdate extends Partial<FriendDto> {
    puuid: FriendDto["puuid"];
}
export const useFriendList = () => {
    const friends = useAtomValue(friendsAtom);
    const friendGroups = useAtomValue(groupsAtom);

    return { friends, friendGroups };
};

export const useIsFriendSelected = (puuid: FriendDto["puuid"]) => {
    const selectedFriends = useAtomValue(selectedFriendsAtom);

    return selectedFriends.includes(puuid);
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
