import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    BoxProps,
    chakra,
    Flex,
    IconButton,
    Stack,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { useEffect } from "react";
import { BiRefresh } from "react-icons/bi";
import { discordGuildsAtom } from "../../components/LCUConnector";
import { refreshGuilds } from "./Discord";
import { SummonerPanel } from "./SummonerPanel";
import { AddSummonerButton } from "./AddSummonerButton";

export const DiscordGuildList = (props: BoxProps) => {
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
            <Stack></Stack>
        </Stack>
    );
};
