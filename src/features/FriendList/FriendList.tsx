import { Spinner, Stack } from "@chakra-ui/react";
import { FriendGroupRow } from "./FriendGroup";
import { useFriendList } from "./useFriendList";

export const FriendList = () => {
    const { friendGroups } = useFriendList();
    if (!friendGroups?.length) return <Spinner />;
    return (
        <Stack whiteSpace="nowrap" overflowY="auto" h="100%" ml="20px">
            {friendGroups?.map((group) => (
                <FriendGroupRow key={group.groupId} group={group} />
            ))}
        </Stack>
    );
};
