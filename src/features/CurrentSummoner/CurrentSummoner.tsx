import { Box, chakra, Flex, Spinner, Stack } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { useQuery } from "react-query";
import { leagueSummonerAtom } from "../../components/LCUConnector";
import { ProfileIcon } from "../DataDragon/Profileicon";
import { getFriendRanks } from "../FriendDetails/FriendDetails";
import { FriendRankingGraph } from "../FriendDetails/FriendRankingGraph";

export const CurrentSummoner = () => {
    const currentSummoner = useAtomValue(leagueSummonerAtom);
    const friendQuery = useQuery(
        ["friend", currentSummoner!.puuid],
        () => getFriendRanks(currentSummoner!.puuid!),
        { enabled: !!currentSummoner }
    );

    if (friendQuery.isLoading) return <Spinner />;
    if (!friendQuery.data) return null;

    return (
        <Stack h="100%">
            {currentSummoner && (
                <Flex p="20px">
                    <ProfileIcon icon={currentSummoner.profileIconId} />
                    <Flex direction="column" ml="20px" fontSize="18px">
                        <chakra.span fontSize="15px">Connected as</chakra.span>
                        <chakra.span fontWeight="600">{currentSummoner?.displayName}</chakra.span>
                    </Flex>
                </Flex>
            )}
            <Box h="100%" w="100%">
                <FriendRankingGraph friend={friendQuery.data} />
            </Box>
        </Stack>
    );
};
