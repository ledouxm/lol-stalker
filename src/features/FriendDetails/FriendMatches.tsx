import { Box, Center, Flex, Spinner, Stack } from "@chakra-ui/react";
import { makeArrayOf } from "@pastable/core";
import { useQuery } from "react-query";
import { FriendDto, Game, MatchDto } from "../../types";
import { electronRequest } from "../../utils";
import { ChampionIcon } from "../DataDragon/ChampionIcon";
import { ItemIcon } from "../DataDragon/ItemIcon";
import { SummonerSpellIcon } from "../DataDragon/SummonerSpellIcon";
import { useChampionDataById } from "../DataDragon/useChampionsList";
import { useItemsDataByIds } from "../DataDragon/useItemsList";
import { useSummonerSpellsDataByIds } from "../DataDragon/useSummonerSpellsList";

const getMatchesByPuuid = async (puuid: string) =>
    electronRequest<MatchDto>("friend/matches", puuid);
export const FriendMatches = ({ puuid }: Pick<FriendDto, "puuid">) => {
    const query = useQuery(["matches", puuid], () => getMatchesByPuuid(puuid));

    if (query.isLoading) return <Spinner />;
    if (query.isError) return <Box>An error has occured</Box>;

    const matchObj = query.data!;
    const games = matchObj?.games?.games;

    return (
        <Center w="100%" h="100%" overflowY="auto">
            {query.isLoading ? (
                <Spinner />
            ) : (
                <Stack spacing="5px" whiteSpace="nowrap" h="100%">
                    {games.map((game) => (
                        <GameRow game={game} key={game.gameId} />
                    ))}
                </Stack>
            )}
        </Center>
    );
};

export const GameRow = ({ game }: { game: Game }) => {
    const participant = game.participants[0];
    const stats = participant.stats;
    const champion = useChampionDataById(participant.championId);
    const summonerSpells = useSummonerSpellsDataByIds([
        participant.spell1Id,
        participant.spell2Id,
    ])!;
    //@ts-ignore
    const items = useItemsDataByIds(makeArrayOf(7).map((_, index) => stats["item" + index]));

    return (
        <Flex alignItems="center" w="700px" bgColor="blackAlpha.500" p="5px">
            <Box pos="relative" mr="20px">
                {champion ? <ChampionIcon image={champion.image.full} /> : <Spinner />}
                <Center
                    pos="absolute"
                    bottom="0"
                    right="-10px"
                    textAlign="center"
                    border="1px solid orange"
                    borderRadius="50%"
                    bgColor="black"
                    boxSize="25px"
                >
                    {stats.champLevel}
                </Center>
            </Box>
            <Flex flexDirection="column" mr="50px">
                <Box color={stats.win ? "blue-win" : "red-loss"}>{stats.win ? "Win" : "Loss"}</Box>
                <Box>
                    {game.gameMode === "CLASSIC" && game.gameType === "MATCHED_GAME"
                        ? "SoloQ ranked"
                        : "Not soloQ lol"}
                </Box>
                <Flex>
                    <SummonerSpellIcon image={summonerSpells[0].image.full} />
                    <SummonerSpellIcon image={summonerSpells[1].image.full} ml="1px" />
                </Flex>
            </Flex>
            <Stack mr="20px">
                <Flex>
                    {items &&
                        items.map((item, index) => (
                            <ItemIcon image={item?.image?.full} key={index} />
                        ))}
                </Flex>
                <Stack direction="row" justifyContent="space-between">
                    <Flex>
                        <Box>{formatKDA(participant)}</Box>
                    </Flex>
                    <Box>{stats.totalMinionsKilled} cs</Box>
                    <Box>{stats.goldEarned} golds</Box>
                </Stack>
            </Stack>
            <Stack>
                <Box>{secondsToHMS(game.gameDuration)}</Box>
                <Box>{formatGameDate(game.gameCreationDate)}</Box>
            </Stack>
        </Flex>
    );
};

const formatGameDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return (
        date.toLocaleDateString() +
        " - " +
        date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    );
};

export const formatKDA = (participant: Game["participants"][0]) =>
    `${participant.stats.kills} / ${participant.stats.deaths} / ${participant.stats.assists}`;

const addZeroIfOneDigit = (number: number) => (number < 10 ? "0" + number : number.toString());
export const secondsToHMS = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return (
        (hours ? hours + ":" : "") +
        addZeroIfOneDigit(minutes % 60) +
        ":" +
        addZeroIfOneDigit(seconds % 60)
    );
};
