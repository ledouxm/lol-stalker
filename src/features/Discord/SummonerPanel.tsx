import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex } from "@chakra-ui/react";
import { DiscordGuild } from "../../components/LCUConnector";
import { electronMutation } from "../../utils";
import { useRemoveSummonersMutation } from "./AddSummonerModal";

export const SummonerPanel = ({
    summoner,
    guildId,
    channelId,
}: {
    summoner: DiscordGuild["summoners"][0];
    guildId: string;
    channelId: string;
}) => {
    const removeSummonersMutation = useRemoveSummonersMutation();
    return (
        <Flex justifyContent="space-between" alignItems="center">
            <Box key={summoner.id}>{summoner.name}</Box>
            <CloseIcon
                boxSize="15px"
                cursor="pointer"
                onClick={() =>
                    removeSummonersMutation.mutate({
                        guildId,
                        channelId,
                        summoners: [summoner.puuid],
                    })
                }
            />
        </Flex>
    );
};
