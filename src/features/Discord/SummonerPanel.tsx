import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex } from "@chakra-ui/react";
import { DiscordGuild } from "../../components/LCUConnector";
import { electronMutation } from "../../utils";

export const SummonerPanel = ({
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
