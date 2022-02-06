import {
    Accordion,
    Box,
    Button,
    Center,
    chakra,
    Divider,
    Flex,
    ListItem,
    Spinner,
    Stack,
    UnorderedList,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { leagueSummonerAtom } from "../../components/LCUConnector";
import { ProfileIcon } from "../DataDragon/Profileicon";
import { FriendGroupRow } from "./FriendGroup";
import { useFriendList } from "./useFriendList";

export const FriendList = () => {
    const { friendGroups } = useFriendList();
    const leagueSummoner = useAtomValue(leagueSummonerAtom);
    if (!friendGroups?.length)
        return (
            <Center direction="column" h="100%">
                <Box>No friend. You can try refreshing the page (CTRL-R)</Box>
            </Center>
        );
    return (
        <Flex h="100%">
            <Stack flex="1" mt="10px" pl="20px" shouldWrapChildren>
                <Flex alignItems="center">
                    {leagueSummoner && (
                        <>
                            <ProfileIcon icon={leagueSummoner?.profileIconId} />
                            <Flex direction="column" ml="20px" fontSize="18px">
                                <chakra.span fontSize="15px">Connected as</chakra.span>
                                <chakra.span fontWeight="600">
                                    {leagueSummoner?.displayName}
                                </chakra.span>
                            </Flex>
                        </>
                    )}
                </Flex>
                <Divider my="7px" />
                <Flex h="100%" p="10px" pt="0px">
                    <UnorderedList spacing="10px">
                        <ListItem>This is your LoL friendlist</ListItem>

                        <ListItem>
                            Select the friends you want to receive Windows notifications from
                        </ListItem>
                        <ListItem>
                            You can also filter using the "Show all" checkbox on the Notifications
                            page
                        </ListItem>
                    </UnorderedList>
                </Flex>
            </Stack>
            <Divider h="70%" alignSelf="center" mx="20px" orientation="vertical" />

            <Flex flexDirection="column" h="100%" flex="2">
                <Box fontSize="20px" pt="12px" pb="12px" fontWeight="bold" my="10px">
                    Friendlist
                </Box>
                <Divider w="calc(100% - 20px)" />
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
                <Accordion
                    whiteSpace="nowrap"
                    overflowY="auto"
                    w="100%"
                    h="100%"
                    pr="20px"
                    allowMultiple
                >
                    {friendGroups?.map((group) => (
                        <FriendGroupRow key={group.groupId} group={group} />
                    ))}
                </Accordion>
            </Flex>
        </Flex>
    );
};
