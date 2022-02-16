import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Icon, Tooltip } from "@chakra-ui/react";
import { FaUserFriends } from "react-icons/fa";
import { DiscordGuild } from "../../components/LCUConnector";
import { useRemoveSummonersMutation } from "./AddSummonerModal";

export const SummonerPanel = ({
    summoner,
    guildId,
    channelId,
    isInFriendList,
}: {
    summoner: DiscordGuild["summoners"][0];
    guildId: string;
    channelId: string;
    isInFriendList?: boolean;
}) => {
    const removeSummonersMutation = useRemoveSummonersMutation();
    return (
        <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
                <Box key={summoner.id}>{summoner.name}</Box>
                {isInFriendList && (
                    <Tooltip label="In your friendlist">
                        <Box>
                            <Icon ml="10px" as={FaUserFriends} />
                        </Box>
                    </Tooltip>
                )}
            </Flex>
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
