import { Center, Spinner, Stack } from "@chakra-ui/react";
import { useFriendList } from "./useFriendList";
import { FriendGroupRow } from "./FriendGroup";

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
