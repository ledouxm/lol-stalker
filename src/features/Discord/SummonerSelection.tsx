import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Center,
    Flex,
    Icon,
    ModalCloseButton,
    ModalContent,
    Stack,
} from "@chakra-ui/react";
import { useSelection } from "@pastable/core";
import { BiFolder } from "react-icons/bi";
import { useQuery } from "react-query";
import { DiscordGuild } from "../../components/LCUConnector";
import { electronRequest } from "../../utils";
import { useFriendList } from "../FriendList/useFriendList";
import { getBgColor } from "./discordUtils";

type SummonerSelection = Omit<DiscordGuild["summoners"][0], "channelId">;
export const AddSummonerModal = ({
    summoners,
    guildName,
    guildId,
    channelId,
    onClose,
    isRestricted,
}: {
    summoners: DiscordGuild["summoners"];
    guildName: string;
    guildId: string;
    channelId: string;
    onClose: () => void;
    isRestricted?: boolean;
}) => {
    const { friendGroups } = useFriendList();
    const [selection, api] = useSelection<SummonerSelection>({
        getId: (item) => item.puuid,
    });

    const meQuery = useQuery("me", () => electronRequest("me"));

    if (!friendGroups?.length)
        return (
            <Center direction="column" h="100%">
                <Box>No friend. You can try refreshing the page (CTRL-R)</Box>
            </Center>
        );

    const summonersIds = summoners.map((summoner) => summoner.puuid);
    const selectionIds = selection.map((selected) => selected.puuid);
    const { toAdd, toRemove } = selection.reduce(
        (acc, current) =>
            summoners.find((summoner) => summoner.puuid === current.puuid)
                ? { ...acc, toRemove: [...acc.toAdd, current] }
                : { ...acc, toAdd: [...acc.toAdd, current] },
        { toAdd: [] as SummonerSelection[], toRemove: [] as SummonerSelection[] }
    );
    const currentNbSelected = summoners.length + toAdd.length - toRemove.length;

    const onClick = () => {
        if (toAdd.length) {
            window.Main.sendMessage("discord/add-friends", {
                channelId,
                guildId,
                summoners: toAdd,
            });
        }
        if (toRemove.length) {
            window.Main.sendMessage("discord/remove-friends", {
                channelId,
                guildId,
                summoners: toRemove.map((summoner) => summoner.puuid),
            });
        }
        onClose();
    };

    return (
        <ModalContent p="20px">
            <ModalCloseButton />
            {selection.length !== 0 && (
                <Center position="fixed" bottom="0" left="50%" transform="translateX(-50%)">
                    <Button
                        colorScheme="blue"
                        onClick={onClick}
                        isDisabled={isRestricted && currentNbSelected > 10}
                    >
                        Apply ({selection.length})
                    </Button>
                </Center>
            )}
            <Box pb="20px" pr="50px" color="gray.400" textAlign="center">
                Add or remove summoners to <b>{guildName}</b> stalking list
            </Box>
            {isRestricted && (
                <Box
                    textAlign="center"
                    color={
                        !toRemove.length && !toAdd.length
                            ? "white"
                            : currentNbSelected <= 10
                            ? "green"
                            : "red"
                    }
                >
                    Stalker summoners: {currentNbSelected}/10
                </Box>
            )}
            {meQuery.isSuccess && (
                <Box
                    userSelect="none"
                    p="5px"
                    pl="20px"
                    w="100%"
                    cursor="pointer"
                    bg={getBgColor(summonersIds, selectionIds, meQuery.data?.puuid)}
                    onClick={() =>
                        api.toggle({
                            name: meQuery.data.displayName,
                            puuid: meQuery.data.puuid,
                            id: 0,
                        })
                    }
                >
                    Me ({meQuery.data.displayName})
                </Box>
            )}
            <Accordion allowMultiple>
                {friendGroups.map((group) => (
                    <AccordionItem key={group.groupId}>
                        <AccordionButton alignItems="center">
                            <Icon as={BiFolder} boxSize="20px" />
                            <Box ml="10px" fontWeight="600">
                                {group.groupName}
                            </Box>
                        </AccordionButton>
                        <AccordionPanel>
                            <Stack>
                                {group.friends.map((friend) => (
                                    <Flex key={friend.puuid}>
                                        <Box
                                            userSelect="none"
                                            p="5px"
                                            w="100%"
                                            cursor="pointer"
                                            bg={getBgColor(
                                                summonersIds,
                                                selectionIds,
                                                friend.puuid
                                            )}
                                            onClick={() => api.toggle(friend)}
                                        >
                                            {friend.name}
                                        </Box>
                                    </Flex>
                                ))}
                            </Stack>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </ModalContent>
    );
};
