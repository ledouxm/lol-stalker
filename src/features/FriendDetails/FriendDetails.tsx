import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, Spinner, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { FriendAllRanksDto, FriendDto, RankDto } from "../../types";
import { electronRequest } from "../../utils";
import { ProfileIcon } from "../DataDragon/Profileicon";
import { FriendMatches } from "./FriendMatches";
import { FriendNotifications } from "./FriendNotifications";
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

    if (friendQuery.isLoading) return <Spinner />;
    if (friendQuery.error) return <Box>An error has occured</Box>;
    const friend = friendQuery.data!;

    return (
        <Stack flexDir="column" p="10px" w="100%" minW="700px" h="100%">
            <Flex pos="absolute" top="10px" left="10px" h="100%">
                <ArrowBackIcon boxSize="30px" cursor="pointer" onClick={() => navigate("/")} />
            </Flex>
            <Flex alignItems="center" h="100px" justifyContent="center">
                <ProfileIcon icon={friend.icon} />
                <Flex direction="column" ml="10px">
                    <Box fontSize="20px" fontWeight="bold">
                        {friend.name}
                    </Box>
                    <Box color="gray.400" mt="-5px">
                        #{friend.gameTag}
                    </Box>
                </Flex>
            </Flex>

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
                {renderComponentByState[state](puuid!)}
            </Flex>
        </Stack>
    );
};

const renderComponentByState = {
    notifications: (puuid: string) => <FriendNotifications puuid={puuid} />,
    "match-history": (puuid: string) => <FriendMatches puuid={puuid} />,
    "old-names": (puuid: string) => <FriendNotifications puuid={puuid} />,
};
