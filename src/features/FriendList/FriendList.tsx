import { Center, Spinner, Stack } from "@chakra-ui/react";
import { selectedFriendsAtom, useFriendList } from "./useFriendList";
import { FriendGroupRow } from "./FriendGroup";
import { useAtomValue } from "jotai/utils";

export const FriendList = () => {
    const { friendGroups } = useFriendList();
    if (!friendGroups?.length) return null;
    return (
        <Stack w="250px">
            {friendGroups?.map((group) => (
                <FriendGroupRow key={group.groupId} group={group} />
            ))}
        </Stack>
    );
};
