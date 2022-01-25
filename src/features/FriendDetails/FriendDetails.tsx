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
    const [state, setState] = useState<FriendDetailsState>("notifications");
    const navigate = useNavigate();

    const friendQuery = useQuery(["friend", puuid], () => getFriendRanks(puuid!));

    if (friendQuery.isLoading) return <Spinner />;
    if (friendQuery.error) return <Box>An error has occured</Box>;

    const friend = friendQuery.data!;
    return (
        <Stack p="10px" w="100%">
            <Flex>
                <ArrowBackIcon boxSize="20px" cursor="pointer" onClick={() => navigate("/")} />
            </Flex>
            <Flex alignItems="center">
                <ProfileIcon icon={friend.icon} />
                <Box ml="10px">{friend.name}</Box>
            </Flex>
            <Flex direction="row" spacing="30px">
                <SwitchStateButton
                    onClick={() => setState("notifications")}
                    state={state}
                    stateName="notifications"
                >
                    Notification history
                </SwitchStateButton>
                <SwitchStateButton
                    onClick={() => setState("match-history")}
                    state={state}
                    stateName="match-history"
                >
                    Match history
                </SwitchStateButton>
            </Flex>
            <Flex justifyContent="space-between" whiteSpace="nowrap" w="100%">
                {state === "notifications" ? (
                    <FriendNotifications puuid={puuid!} />
                ) : (
                    <FriendMatches puuid={puuid!} />
                )}
            </Flex>
        </Stack>
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
        p="20px"
        _hover={{ bgColor: "gray.500" }}
        cursor="pointer"
        fontSize="20px"
        {...props}
    />
);
