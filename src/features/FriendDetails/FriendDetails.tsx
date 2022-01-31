import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Center, chakra, Flex, Spinner, Stack } from "@chakra-ui/react";
import { last } from "@pastable/core";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { FriendAllRanksDto, FriendDto, RankDto } from "../../types";
import { electronRequest } from "../../utils";
import { ProfileIcon } from "../DataDragon/Profileicon";
import { FriendMatches } from "./FriendMatches";
import { FriendNotifications } from "./FriendNotifications";
import { FriendOldNames } from "./FriendOldNames";
import { StateTabs } from "./StateTabs";

export const formatRank = (ranking: Pick<RankDto, "division" | "tier" | "leaguePoints">) =>
    `${ranking.tier}${ranking.division !== "NA" ? ` ${ranking.division}` : ""} - ${
        ranking.leaguePoints
    } LP`;

const getFriendRanks = (puuid: FriendDto["puuid"]) =>
    electronRequest<FriendAllRanksDto>("friendList/friend", puuid);

type FriendDetailsState = "notifications" | "match-history";
export const FriendDetails = () => {
    const { puuid } = useParams<{ puuid: string }>();
    const [state, setState] = useState<FriendDetailsState>("match-history");
    const navigate = useNavigate();
    const friendQuery = useQuery(["friend", puuid], () => getFriendRanks(puuid!));

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
                <ArrowBackIcon boxSize="30px" cursor="pointer" onClick={() => navigate(-1)} />
            </Flex>
            <Profile friend={friend} />
            <StateTabs
                tabs={[
                    { name: "match-history", label: "Match history" },
                    { name: "notifications", label: "Notifications history" },
                    { name: "old-names", label: "Names history" },
                ]}
                setState={setState as (state: string) => void}
                state={state}
            />
            <Flex whiteSpace="nowrap" w="100%" h="100%">
                {renderComponentByState[state](friend)}
            </Flex>
        </Stack>
    );
};

export const Profile = ({ friend }: { friend: FriendDto }) => {
    const lastRanking = last(friend.rankings);
    return (
        <Flex alignItems="center" justifyContent="center">
            <Flex alignItems="center">
                <ProfileIcon icon={friend.icon} />
                <Flex direction="column" ml="15px">
                    <Box fontSize="20px" fontWeight="bold">
                        {friend.name} <chakra.span color="gray.500">#{friend.gameTag}</chakra.span>
                    </Box>
                    {lastRanking && (
                        <Box color="gray.400" mt="-5px">
                            {formatRank(lastRanking)}
                        </Box>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

const renderComponentByState = {
    notifications: (friend: FriendDto) => <FriendNotifications friend={friend} />,
    "match-history": (friend: FriendDto) => <FriendMatches puuid={friend.puuid} />,
    "old-names": (friend: FriendDto) => <FriendOldNames friend={friend} />,
};
