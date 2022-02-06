import {
    Box,
    BoxProps,
    Center,
    chakra,
    Divider,
    Flex,
    Spinner,
    Stack,
    useInterval,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { electronRequest } from "../../utils";
import { ChampionIcon } from "../DataDragon/ChampionIcon";
import { useChampionDataById } from "../DataDragon/useChampionsList";
import { InGameFriend } from "./Notifications";

export const InGameFriends = () => {
    const query = useQuery("friendList/in-game", () =>
        electronRequest<InGameFriend[]>("friendList/in-game")
    );

    if (query.isLoading)
        return (
            <Center w="200px">
                <Spinner />
            </Center>
        );
    if (query.isError)
        return (
            <Center w="200px">
                <Box>An error has occured</Box>
            </Center>
        );
    if (!query.data)
        return (
            <Center w="200px">
                <Box>No friend activity</Box>
            </Center>
        );

    const inGameFriends = query.data;

    return (
        <Stack w="300px" overflowY="auto">
            <Box fontSize="20px" pt="5px" my="10px" fontWeight="bold">
                Friend activity
            </Box>
            <Divider w="70%" mx="0" />
            {inGameFriends
                .sort((a, b) => a.timeStamp - b.timeStamp)
                .sort(
                    (a, b) =>
                        gameStatusOrder.findIndex((item) => item === a.gameStatus) -
                        gameStatusOrder.findIndex((item) => item === b.gameStatus)
                )
                .map((friend) => (
                    <InGameFriendRow friend={friend} key={friend.puuid} />
                ))}
        </Stack>
    );
};
const InGameFriendRow = ({ friend }: { friend: InGameFriend }) => {
    const champion = useChampionDataById(friend.championId);
    const navigate = useNavigate();
    return (
        <Flex alignItems="center" justifyContent="space-between" p="5px" px="15px">
            <Flex direction="column" w="100%" key={friend.puuid}>
                <Box
                    fontWeight="bold"
                    onClick={() => navigate(`/friend/${friend.puuid}`)}
                    cursor="pointer"
                >
                    {friend.name}
                </Box>
                <Flex mt="-3px" justifyContent="space-between">
                    <chakra.span color="gray.500">
                        {gameStatusLabelMap[friend.gameStatus] || friend.gameStatus}
                    </chakra.span>
                    {friend.timeStamp && (
                        <CountDown
                            color="rgb(8, 174, 199)"
                            timeStamp={Number(friend.timeStamp)}
                            pr="5px"
                        />
                    )}
                </Flex>
            </Flex>
            {champion ? (
                <ChampionIcon image={champion.image.full} boxSize="40px" />
            ) : (
                <Box boxSize="40px" />
            )}
        </Flex>
    );
};
const nbSecondsAndMinutesBetween = (ts1: number, ts2: number) => {
    const totalS = Math.round(Math.abs(ts2 - ts1) / 1000);
    const m = Math.round(totalS / 60);
    const s = totalS % 60;

    return { m, s };
};
const nbSecondesAndMinutesBetweenNowAnd = (ts: number) =>
    nbSecondsAndMinutesBetween(ts, Date.now());
const add0if1Digit = (nb: number) => (nb < 10 ? "0" + nb : nb);
const CountDown = ({ timeStamp, ...props }: { timeStamp: number } & BoxProps) => {
    const [diff, setDiff] = useState(nbSecondesAndMinutesBetweenNowAnd(timeStamp));
    useInterval(() => setDiff(nbSecondesAndMinutesBetweenNowAnd(timeStamp)), 1000);

    return (
        <Box {...props}>
            {diff.m}:{add0if1Digit(diff.s)}
        </Box>
    );
};
type GameStatus = "hosting_RANKED_SOLO_5x5" | "inQueue" | "inGame" | "championSelect";
const gameStatusOrder: GameStatus[] = [
    "inGame",
    "championSelect",
    "inQueue",
    "hosting_RANKED_SOLO_5x5",
];
const gameStatusLabelMap: Record<string, string> = {
    hosting_RANKED_SOLO_5x5: "In Lobby",
    inQueue: "In queue",
    inGame: "In game",
    championSelect: "In champion select",
};
