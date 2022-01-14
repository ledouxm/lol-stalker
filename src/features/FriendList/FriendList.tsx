import { Center, Spinner, Stack } from "@chakra-ui/react";
import { useFriendList } from "./useFriendList";
import { FriendGroup } from "./FriendGroup";

export const FriendList = () => {
    const friendListQuery = useFriendList();

    if (friendListQuery.isLoading) return <Spinner />;
    if (friendListQuery.error) return <Center>An error as occured fetching friendlist data</Center>;

    const friendListGroups = friendListQuery.data;

    return (
        <Stack w="250px">
            {friendListGroups?.map((group) => (
                <FriendGroup key={group.groupId} group={group} />
            ))}
        </Stack>
    );
};

export interface FriendClient {
    division: string;
    groupId: number;
    groupName: string;
    icon: number;
    leaguePoints: number;
    losses: number;
    miniSeriesProgress: string;
    name: string;
    puuid: string;
    tier: string;
    wins: number;
    selected: boolean;
}
