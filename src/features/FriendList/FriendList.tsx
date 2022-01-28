import { Accordion, Button, Flex, Spinner, Stack } from "@chakra-ui/react";
import { FriendGroupRow } from "./FriendGroup";
import { useFriendList } from "./useFriendList";

export const FriendList = () => {
    const { friendGroups } = useFriendList();
    if (!friendGroups?.length) return <Spinner />;
    return (
        <Flex direction="column" h="100%">
            <Flex p="10px">
                <Button
                    onClick={() => window.Main.sendMessage("friendList/select-all", true)}
                    colorScheme="blue"
                >
                    Select all
                </Button>
                <Button
                    ml="10px"
                    onClick={() => window.Main.sendMessage("friendList/select-all", false)}
                    colorScheme="orange"
                >
                    Unselect all
                </Button>
            </Flex>
            <Accordion whiteSpace="nowrap" overflowY="auto" h="100%" allowMultiple>
                {friendGroups?.map((group) => (
                    <FriendGroupRow key={group.groupId} group={group} />
                ))}
            </Accordion>
        </Flex>
    );
};
