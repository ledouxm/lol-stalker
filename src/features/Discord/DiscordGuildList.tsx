import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    BoxProps,
    Center,
    chakra,
    Flex,
    IconButton,
    Spinner,
    Stack,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { useEffect } from "react";
import { BiRefresh } from "react-icons/bi";
import { DiscordGuild } from "../../components/LCUConnector";
import { refreshGuilds } from "./Discord";
import { SummonerPanel } from "./SummonerPanel";
import { AddSummonerButton } from "./AddSummonerButton";
import { LockIcon } from "@chakra-ui/icons";
import { useQuery } from "react-query";
import { api } from "../../api";

const getGuilds = async () => (await api.get<DiscordGuild[]>("/guilds")).data;
export const useGuildsQuery = () =>
    useQuery<DiscordGuild[]>("guilds", getGuilds, { staleTime: 1000 * 60 * 5 });
export const DiscordGuildList = (props: BoxProps) => {
    const guildsQuery = useGuildsQuery();

    if (guildsQuery.isLoading)
        return (
            <Center w="100%" h="100%">
                <Spinner />
            </Center>
        );
    if (guildsQuery.isError)
        return (
            <Center w="100%" h="100%">
                An error has occured
            </Center>
        );

    const guilds = guildsQuery.data!;
    console.log(guilds);

    return (
        <Stack {...props} p="10px" h="100%" overflowY="auto" w="100%">
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
                                <Flex direction="column" textAlign="left">
                                    <Box fontSize="20px" pb="3px">
                                        {guild.name} - {guild.channelName}{" "}
                                        <chakra.span fontWeight="600">
                                            ({guild.summoners.length}/
                                            {guild.isRestricted ? 10 : "*"})
                                        </chakra.span>
                                        <AccordionIcon ml="10px" />
                                    </Box>
                                    <Box fontSize="sm" color="gray.400" mt="-6px">
                                        {guild.nbStalkers} active stalker
                                        {guild.nbStalkers > 1 ? "s" : ""}
                                    </Box>
                                </Flex>
                            </AccordionButton>
                            <AccordionPanel>
                                {guild.summoners.map((summoner) => (
                                    <SummonerPanel
                                        key={summoner.id}
                                        summoner={summoner}
                                        {...guild}
                                    />
                                ))}
                                <AddSummonerButton {...guild} />
                            </AccordionPanel>
                        </AccordionItem>
                    ))
                )}
            </Accordion>
        </Stack>
    );
};
