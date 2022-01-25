import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, BoxProps, Center, Flex, Spinner, Stack } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { NavLinkProps, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { ProfileIcon } from "../DataDragon/Profileicon";
import { FriendAllRanksDto, FriendDto, RankDto } from "../../types";
import { electronRequest } from "../../utils";
import { FriendMatches } from "./FriendMatches";
import { FriendNotifications } from "./FriendNotifications";
import { AppLink } from "../../components/Navbar";
import { useState } from "react";

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
    console.log(friend);
    return (
        <Center flexDir="column" p="10px" w="100%" pos="relative" minW="700px">
            <Flex pos="absolute" top="10px" left="10px">
                <ArrowBackIcon boxSize="30px" cursor="pointer" onClick={() => navigate("/")} />
            </Flex>
            <Flex alignItems="center">
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
            <Flex direction="row" spacing="30px">
                <SwitchStateButton
                    onClick={() => setState("match-history")}
                    state={state}
                    stateName="match-history"
                >
                    Match history
                </SwitchStateButton>
                <SwitchStateButton
                    onClick={() => setState("notifications")}
                    state={state}
                    stateName="notifications"
                >
                    Notification history
                </SwitchStateButton>
            </Flex>
            <Flex whiteSpace="nowrap" w="100%">
                {state === "notifications" ? (
                    <FriendNotifications puuid={puuid!} />
                ) : (
                    <FriendMatches puuid={puuid!} />
                )}
            </Flex>
        </Center>
    );
};

const SwitchStateButton = ({
    state,
    stateName,
    ...props
}: BoxProps & { state: FriendDetailsState; stateName: FriendDetailsState }) => (
    <Box
        fontWeight={state === stateName ? "bold" : "initial"}
        textDecoration={state === stateName ? "underline" : "initial"}
        p="10px"
        m="10px"
        _hover={{ bgColor: "gray.700" }}
        cursor="pointer"
        textAlign="center"
        fontSize="16px"
        {...props}
    />
);
