import { CloseIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    BoxProps,
    Button,
    Center,
    CenterProps,
    chakra,
    Divider,
    Flex,
    Icon,
    IconButton,
    ListItem,
    Modal,
    ModalCloseButton,
    ModalContent,
    Stack,
    UnorderedList,
    useDisclosure,
} from "@chakra-ui/react";
import { useSelection } from "@pastable/core";
import { useAtomValue } from "jotai/utils";
import { useEffect } from "react";
import { BiFolder, BiLogOut, BiPlusCircle, BiRefresh, BiTrash } from "react-icons/bi";
import { FaDiscord } from "react-icons/fa";
import { useQuery } from "react-query";
import {
    discordAuthAtom,
    DiscordGuild,
    discordGuildsAtom,
    discordUrlsAtom,
    meAtom,
    socketStatusAtom,
} from "../../components/LCUConnector";
import { electronMutation, electronRequest } from "../../utils";
import { useFriendList } from "../FriendList/useFriendList";

const refreshGuilds = () => electronMutation("discord/guilds");
export const Discord = () => {
    const discordAuth = useAtomValue(discordAuthAtom);
    const socketStatus = useAtomValue(socketStatusAtom);

    if (socketStatus !== "connected") {
        return (
            <Center h="100%">
                <Box>{socketStatus}</Box>
            </Center>
        );
    }

    if (!discordAuth)
        return (
            <Center h="100%">
                <DiscordLoginButton />
            </Center>
        );
    return (
        <Stack h="100%">
            <Flex justifyContent="space-between" h="100%">
                <BotInfos flex="1" />
                <Divider orientation="vertical" h="70%" alignSelf="center" mr="10px" />
                <DiscordGuildList flex="2" />
            </Flex>
        </Stack>
    );
};

const BotInfos = (props: BoxProps) => {
    const guilds = useAtomValue(discordGuildsAtom);
    const me = useAtomValue(meAtom);

    if (!guilds) return null;
    return (
        <Center
            flexDir="column"
            justifyContent="space-between"
            h="100%"
            padding="10px"
            px="20px"
            {...props}
        >
            <Flex flexDir="column">
                {me && (
                    <Flex alignItems="center">
                        <Icon as={FaDiscord} fontSize="50px" />
                        <Flex direction="column" ml="20px" fontSize="18px">
                            <chakra.span fontSize="15px">Connected as</chakra.span>
                            <chakra.span fontWeight="600">
                                {me.username} <chakra.span>#{me.discriminator}</chakra.span>
                            </chakra.span>
                        </Flex>
                        <IconButton
                            ml="10px"
                            onClick={() => electronMutation("store/set", { discordAuth: null })}
                            icon={<BiLogOut size="20px" />}
                            aria-label="Logout"
                        />
                    </Flex>
                )}
                <Divider mt="15px" mb="20px" />
                <Box textAlign="center">
                    The bot is active on <b>{guilds?.length}</b> of your servers
                </Box>
                <Divider my="20px" />
                <UnorderedList spacing="10px">
                    <ListItem>Invite the bot to your Discord server</ListItem>
                    <ListItem>
                        Send <chakra.span fontWeight="600">!stalker init</chakra.span> in the
                        channel you want the bot to send messages in
                    </ListItem>
                    <ListItem>
                        <Flex alignItems="center">Add stalked summoners to the list</Flex>
                    </ListItem>
                </UnorderedList>
            </Flex>
            <BotInvitation />
        </Center>
    );
};

const BotInvitation = (props: CenterProps) => {
    const discordUrls = useAtomValue(discordUrlsAtom);

    if (!discordUrls) return <Box />;

    return (
        <Center {...props}>
            <Button onClick={() => electronRequest("config/open-external", discordUrls.inviteUrl)}>
                Invite the bot
                <ExternalLinkIcon ml="7px" />
            </Button>
            <Button ml="10px" onClick={() => navigator.clipboard.writeText(discordUrls.inviteUrl)}>
                Copy invite url
            </Button>
        </Center>
    );
};

const DiscordGuildList = (props: BoxProps) => {
    const guilds = useAtomValue(discordGuildsAtom);

    useEffect(() => {
        if (!guilds) refreshGuilds();
    }, [guilds]);

    return (
        <Stack {...props} p="10px" h="100%" overflowY="auto">
            <Flex alignItems="center" pb="3px">
                <Box fontSize="20px" my="12px" fontWeight="bold">
                    Stalked summoners
                </Box>
                <IconButton
                    ml="10px"
                    onClick={() => refreshGuilds()}
                    icon={<BiRefresh size="30px" />}
                    aria-label="Refresh guilds"
                />
            </Flex>
            <Accordion allowMultiple>
                {!guilds?.length ? (
                    <Box>No guild</Box>
                ) : (
                    guilds.map((guild) => (
                        <AccordionItem key={guild.guildId}>
                            <AccordionButton>
                                <Flex justifyContent="space-between" w="100%" alignItems="center">
                                    <Flex direction="column" textAlign="left">
                                        <Box fontSize="20px" pb="3px">
                                            {guild.name} - {guild.channelName}{" "}
                                            <chakra.span fontWeight="600">
                                                ({guild.summoners.length})
                                            </chakra.span>
                                            <AccordionIcon ml="10px" />
                                        </Box>
                                        <Box fontSize="sm" color="gray.400" mt="-6px">
                                            {guild.nbStalkers} active stalker
                                            {guild.nbStalkers > 1 ? "s" : ""}
                                        </Box>
                                    </Flex>
                                    <BiTrash
                                        size="20px"
                                        cursor="pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.Main.sendMessage("discord/remove-friends", {
                                                channelId: guild.channelId,
                                                guildId: guild.guildId,
                                                summoners: guild.summoners.map(
                                                    (summoner) => summoner.puuid
                                                ),
                                            });
                                        }}
                                    />
                                </Flex>
                            </AccordionButton>
                            <AccordionPanel>
                                {guild.summoners.map((summoner) => (
                                    <SummonerPanel
                                        key={summoner.id}
                                        summoner={summoner}
                                        channelId={guild.channelId}
                                        guildId={guild.guildId}
                                    />
                                ))}
                                <AddSummonerButton
                                    guildId={guild.guildId}
                                    name={guild.name}
                                    channelId={guild.channelId}
                                    summoners={guild.summoners}
                                />
                            </AccordionPanel>
                        </AccordionItem>
                    ))
                )}
            </Accordion>
            <Stack>{}</Stack>
        </Stack>
    );
};
export const DiscordLoginButton = (props: CenterProps) => {
    const discordUrls = useAtomValue(discordUrlsAtom);

    useEffect(() => {
        if (!discordUrls) electronRequest("config/discord-urls");
    }, [discordUrls]);

    return (
        <Center flexDir="column" {...props}>
            <Icon as={FaDiscord} fontSize="120px" />
            <Button
                mt="10px"
                onClick={() => electronRequest("config/open-external", discordUrls?.authUrl)}
            >
                Log in with Discord
            </Button>
        </Center>
    );
};
const AddSummonerButton = ({
    guildId,
    channelId,
    summoners,
    name,
}: {
    name: string;
    guildId: string;
    channelId: string;
    summoners: DiscordGuild["summoners"];
}) => {
    const disclosure = useDisclosure();

    return (
        <>
            <Center>
                <Center cursor="pointer" onClick={() => disclosure.onOpen()} userSelect="none">
                    <BiPlusCircle size="30px" />
                    <chakra.span ml="10px">Add summoner</chakra.span>
                </Center>
            </Center>
            <Modal {...disclosure}>
                <AddSummonerModal
                    {...disclosure}
                    summoners={summoners}
                    guildName={name}
                    guildId={guildId}
                    channelId={channelId}
                />
            </Modal>
        </>
    );
};

type SummonerSelection = Omit<DiscordGuild["summoners"][0], "channelId">;
const AddSummonerModal = ({
    summoners,
    guildName,
    guildId,
    channelId,
    onClose,
}: {
    summoners: DiscordGuild["summoners"];
    guildName: string;
    guildId: string;
    channelId: string;
    onClose: () => void;
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

    const onClick = () => {
        const { toAdd, toRemove } = selection.reduce(
            (acc, current) =>
                summoners.find((summoner) => summoner.puuid === current.puuid)
                    ? { ...acc, toRemove: [...acc.toAdd, current] }
                    : { ...acc, toAdd: [...acc.toAdd, current] },
            { toAdd: [] as SummonerSelection[], toRemove: [] as SummonerSelection[] }
        );
        if (toAdd.length) {
            // console.log("add", toAdd);
            window.Main.sendMessage("discord/add-friends", {
                channelId,
                guildId,
                summoners: toAdd,
            });
        }
        if (toRemove.length) {
            // console.log("remove", toRemove);

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
                    <Button colorScheme="blue" onClick={onClick}>
                        Apply ({selection.length})
                    </Button>
                </Center>
            )}
            <Box pb="20px" pr="50px" color="gray.400" textAlign="center">
                Add or remove summoners to <b>{guildName}</b> stalking list
            </Box>
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
            {/* <form onSubmit={handleSubmit(() => {})}>
            <Center>
                <Input {...register("summonerToAdd")} />
                <BiPlusCircle size="30px" onClick={() => setIsEdit((edit) => !edit)} />
            </Center>
        </form> */}
        </ModalContent>
    );
};

const getBgColor = (initial: string[], selection: string[], puuid: string) => {
    if (initial.includes(puuid) && selection.includes(puuid)) return "red.400";
    if (!initial.includes(puuid) && !selection.includes(puuid)) return "initial";
    if (initial.includes(puuid) && !selection.includes(puuid)) return "blue.400";
    if (!initial.includes(puuid) && selection.includes(puuid)) return "green.400";
};

const SummonerPanel = ({
    summoner,
    guildId,
    channelId,
}: {
    summoner: DiscordGuild["summoners"][0];
    guildId: string;
    channelId: string;
}) => {
    return (
        <Flex justifyContent="space-between" alignItems="center">
            <Box key={summoner.id}>{summoner.name}</Box>
            <CloseIcon
                boxSize="15px"
                cursor="pointer"
                onClick={() =>
                    electronMutation("discord/remove-friends", {
                        guildId,
                        channelId,
                        summoners: [summoner.puuid],
                    })
                }
            />
        </Flex>
    );
};
