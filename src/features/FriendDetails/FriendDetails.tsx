import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, Spinner, Stack } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileIcon } from "../../components/Profileicon";
import { FriendAllRanksDto, FriendDto, RankDto } from "../../types";
import { electronRequest } from "../../utils";
import { FriendNotifications } from "./FriendNotifications";

export const formatRank = (ranking: Pick<RankDto, "division" | "tier" | "leaguePoints">) =>
    `${ranking.tier}${ranking.division !== "NA" ? ` ${ranking.division}` : ""} - ${
        ranking.leaguePoints
    } LP`;

const getFriendRanks = (puuid: FriendDto["puuid"]) =>
    electronRequest<FriendAllRanksDto>("friendList/friend", puuid);
export const FriendDetails = () => {
    const { puuid } = useParams<{ puuid: string }>();
    const navigate = useNavigate();

    const friendQuery = useQuery(["friend", puuid], () => getFriendRanks(puuid!));

    if (friendQuery.isLoading) return <Spinner />;
    if (friendQuery.error) return <Box>An error has occured</Box>;

    const friend = friendQuery.data!;
    return (
        <Stack p="10px">
            <Flex>
                <ArrowBackIcon boxSize="20px" cursor="pointer" onClick={() => navigate("/")} />
            </Flex>
            <Flex alignItems="center">
                <ProfileIcon icon={friend.icon} />
                <Box ml="10px">{friend.name}</Box>
            </Flex>
            <Flex justifyContent="space-between">
                <Stack>
                    {friend.ranks.map((rank) => (
                        <RankDetails key={rank.id} rank={rank} />
                    ))}
                </Stack>
                <FriendNotifications puuid={puuid!} />
            </Flex>
        </Stack>
    );
};

export const RankDetails = ({ rank }: { rank: RankDto }) => {
    return (
        <Flex>
            <Box>
                {rank.createdAt.toLocaleDateString()} {rank.createdAt.toLocaleTimeString()}
            </Box>
            <Box ml="20px">{formatRank(rank)}</Box>
        </Flex>
    );
};
