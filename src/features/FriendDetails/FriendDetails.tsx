import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, Spinner, Stack } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileIcon } from "../../components/Profileicon";
import { electronRequest } from "../../utils";
import { FriendClient } from "../FriendList/FriendList";

export const formatRank = (ranking: Pick<Rank, "division" | "tier" | "leaguePoints">) =>
    `${ranking.tier} ${ranking.division} - ${ranking.leaguePoints}`;

const getFriendRanks = (puuid: FriendClient["puuid"]) =>
    electronRequest<FriendObject>("friendList/friend", puuid);
export const FriendDetails = () => {
    const { puuid } = useParams<{ puuid: string }>();
    const navigate = useNavigate();

    const friendQuery = useQuery(["friend", puuid], () => getFriendRanks(puuid!));

    if (friendQuery.isLoading) return <Spinner />;
    if (friendQuery.error) return <Box>An error has occured</Box>;

    const friend = friendQuery.data!;
    console.log(friend);
    return (
        <Stack p="10px">
            <Flex>
                <ArrowBackIcon boxSize="20px" cursor="pointer" onClick={() => navigate("/")} />
            </Flex>
            <Flex alignItems="center">
                <ProfileIcon icon={friend.icon} />
                <Box ml="10px">{friend.name}</Box>
            </Flex>
            <Stack>
                {friend.ranks.map((rank) => (
                    <RankDetails key={rank.id} rank={rank} />
                ))}
            </Stack>
        </Stack>
    );
};

export const RankDetails = ({ rank }: { rank: Rank }) => {
    return (
        <Flex>
            <Box>
                {rank.createdAt.toLocaleDateString()} {rank.createdAt.toLocaleTimeString()}
            </Box>
            <Box ml="20px">{formatRank(rank)}</Box>
        </Flex>
    );
};

export interface Rank {
    id: number;
    division: string;
    tier: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    miniSeriesProgress: string;
    puuid: string;
    createdAt: Date;
}

export interface FriendObject {
    puuid: string;
    id: string;
    gameName: string;
    gameTag: string;
    groupId: number;
    groupName: string;
    name: string;
    summonerId: number;
    icon: number;
    createdAt: Date;
    selected: boolean;
    ranks: Rank[];
}
