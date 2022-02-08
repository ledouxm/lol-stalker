import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Spinner, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "react-query";
import {
    useInRouterContext,
    useLocation,
    useNavigate,
    useNavigationType,
    useParams,
} from "react-router-dom";
import { CartesianGrid } from "recharts";
import { FriendAllRanksDto, FriendDto, RankDto } from "../../types";
import { electronRequest } from "../../utils";
import { FriendMatches } from "./FriendMatches";
import { FriendNotifications } from "./FriendNotifications";
import { FriendOldNames } from "./FriendOldNames";
import { FriendRankingGraph } from "./FriendRankingGraph";
import { Profile } from "./Profile";
import { StateTabs } from "./StateTabs";

export const formatRank = (ranking: Pick<RankDto, "division" | "tier" | "leaguePoints">) =>
    `${ranking.tier}${ranking.division !== "NA" ? ` ${ranking.division}` : ""} - ${
        ranking.leaguePoints
    } LP`;

const getFriendRanks = (puuid: FriendDto["puuid"]) =>
    electronRequest<FriendAllRanksDto>("friendList/friend", puuid);

type FriendDetailsState = "notifications" | "match-history" | "graph" | "old-names";
export const FriendDetails = () => {
    const { puuid } = useParams<{ puuid: string }>();
    const [state, setState] = useState<FriendDetailsState>("graph");
    const navigate = useNavigate();
    const friendQuery = useQuery(["friend", puuid], () => getFriendRanks(puuid!));
    const navigationType = useNavigationType();

    const canGoBack = navigationType === "PUSH";

    if (friendQuery.isLoading)
        return (
            <Center h="100%">
                <Spinner />
            </Center>
        );
    if (friendQuery.error)
        return (
            <Center h="100%">
                <Box>An error has occured</Box>
            </Center>
        );
    const friend = friendQuery.data!;

    return (
        <Stack flexDir="column" p="10px" w="100%" minW="700px" h="100%">
            <Flex pos="absolute" top="10px" left="10px" h="100%">
                <ArrowBackIcon
                    boxSize="30px"
                    cursor="pointer"
                    //@ts-ignore
                    onClick={() => navigate(canGoBack ? -1 : "/")}
                />
            </Flex>
            <Profile friend={friend} />
            <StateTabs
                tabs={[
                    { name: "graph", label: "Elo graph" },
                    { name: "match-history", label: "Match history" },
                    { name: "notifications", label: "Notifications history" },
                    { name: "old-names", label: "Names history" },
                ]}
                setState={setState as (state: string) => void}
                state={state}
            />
            <Flex whiteSpace="nowrap" w="100%" h="100%" maxH="calc(100% - 140px)">
                {renderComponentByState[state](friend)}
            </Flex>
        </Stack>
    );
};

const renderComponentByState = {
    graph: (friend: FriendDto) => <FriendRankingGraph friend={friend} />,
    notifications: (friend: FriendDto) => <FriendNotifications friend={friend} />,
    "match-history": (friend: FriendDto) => <FriendMatches puuid={friend.puuid} />,
    "old-names": (friend: FriendDto) => <FriendOldNames friend={friend} />,
};
