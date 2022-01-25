import { Spinner, Stack } from "@chakra-ui/react";
import { Suspense } from "react";
import { FriendGroupRow } from "./FriendGroup";
import { useFriendList } from "./useFriendList";

export const FriendList = () => {
    const { friendGroups } = useFriendList();
    if (!friendGroups?.length) return <Spinner />;
    return (
        <Stack w="400px" ml="20px">
            {friendGroups?.map((group) => (
                <FriendGroupRow key={group.groupId} group={group} />
            ))}
        </Stack>
    );
};
