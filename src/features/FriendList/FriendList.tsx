import { Accordion, Box, Button, Center, Flex, Spinner, Stack } from "@chakra-ui/react";
import { FriendGroupRow } from "./FriendGroup";
import { useFriendList } from "./useFriendList";

export const FriendList = () => {
    const { friendGroups } = useFriendList();
    console.log(friendGroups);
    if (!friendGroups?.length)
        return (
            <Center direction="column" h="100%">
                <Box>No friend. You can try refreshing the page (CTRL-R)</Box>
            </Center>
        );
    return (
        <Center flexDirection="column" h="100%">
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
                    colorScheme="red"
                >
                    Unselect all
                </Button>
            </Flex>
            <Accordion whiteSpace="nowrap" overflowY="auto" w="500px" h="100%" allowMultiple>
                {friendGroups?.map((group) => (
                    <FriendGroupRow key={group.groupId} group={group} />
                ))}
            </Accordion>
        </Center>
    );
};
