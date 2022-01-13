import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
    Box,
    BoxProps,
    Center,
    chakra,
    Checkbox,
    Flex,
    Spinner,
    Stack,
    useDisclosure,
} from "@chakra-ui/react";
import { pick } from "@pastable/core";
import { useAtomValue } from "jotai/utils";
import { ChangeEvent, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";
import { sendMessage } from "../utils";
import { patchVersionAtom } from "./LCUConnector";

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

export const FriendGroup = ({ group }: { group: GroupClient }) => {
    const { isOpen, onToggle } = useDisclosure();

    const isChecked = useMemo(() => group.friends.every((friend) => friend.selected), [group]);
    const isIndeterminate =
        useMemo(() => group.friends.some((friend) => friend.selected), [group]) && !isChecked;
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        const puuids = group.friends.map((friend) => friend.puuid);
        sendMessage("friendList/select", { type: newState ? "add" : "remove", puuids });
    };

    return (
        <Flex flexDir="column" pl="10px">
            <Flex alignItems="center" onClick={onToggle}>
                <Checkbox
                    defaultChecked={isChecked}
                    checked={isChecked}
                    isIndeterminate={isIndeterminate}
                    outline="none"
                    boxShadow="none"
                    onChange={onChange}
                />
                {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                <chakra.span
                    textTransform="uppercase"
                    fontWeight="bold"
                    cursor="pointer"
                    userSelect="none"
                >
                    {group.groupName} ({group.friends.length})
                </chakra.span>
            </Flex>
            {isOpen && (
                <Stack mt="10px">
                    {group.friends.map((friend) => (
                        <FriendRow key={friend.puuid} friend={friend} />
                    ))}
                </Stack>
            )}
        </Flex>
    );
};

export const FriendRow = ({ friend }: { friend: FriendClient }) => {
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        sendMessage("friendList/select", {
            type: newState ? "add" : "remove",
            puuids: friend.puuid,
        });
    };

    return (
        <Flex pl="15px" alignItems="center" opacity={friend.selected ? "1" : ".3"}>
            <Checkbox isChecked={friend.selected} onChange={onChange} />
            <Profileicon icon={friend.icon} ml="10px" />
            <chakra.span pl="15px">{friend.name}</chakra.span>
        </Flex>
    );
};
export const Profileicon = ({ icon, ...props }: { icon: FriendClient["icon"] } & BoxProps) => {
    const patchVersion = useAtomValue(patchVersionAtom);

    if (!patchVersion)
        return (
            <Box boxSize="50px" {...props}>
                <Spinner />
            </Box>
        );

    const src = getProfileIconUrl(patchVersion, icon);

    return <chakra.img boxSize="50px" borderRadius="50%" src={src} {...props} />;
};

export const useFriendList = () => {
    const queryClient = useQueryClient();
    useEffect(() => {
        window.Main.on("friendList/invalidate", () => queryClient.invalidateQueries("friendList"));
    }, []);
    return useQuery("friendList", getFriendListFilteredByGroups);
};
export const getFriendListFilteredByGroups = async () => {
    const friends = await electronRequest<FriendClient[]>("friendList/lastRank");

    return friends
        .reduce((groups, friend) => {
            const groupIndex = groups.findIndex((group) => group.groupId === friend.groupId);
            if (groupIndex === -1) {
                groups.push({ ...pick(friend, ["groupId", "groupName"]), friends: [friend] });
            } else groups[groupIndex].friends.push(friend);
            return groups;
        }, [] as GroupClient[])
        .sort((_, groupB) => (groupB.groupName === "**Default" ? -1 : 1));
};

// export const electronRequest = (event: string, data?: any) =>

export const getProfileIconUrl = (patchVersion: string, icon: FriendClient["icon"]) =>
    `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${icon}.png`;

const timeoutDelay = 5000;
export function electronRequest<T = any>(event: string, data?: any) {
    return new Promise<T>((resolve, reject) => {
        const timeout = setTimeout(reject, timeoutDelay);
        window.Main.on(event, (data: any) => {
            clearTimeout(timeout);
            resolve(data);
        });
        window.ipcRenderer.send(event, data);
    });
}
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

export interface GroupClient {
    groupId: number;
    groupName: string;
    friends: FriendClient[];
}
