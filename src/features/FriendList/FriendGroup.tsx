import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { chakra, Checkbox, Flex, Stack, useDisclosure } from "@chakra-ui/react";
import { ChangeEvent, useMemo } from "react";
import { sendMessage } from "../../utils";
import { ProfileIcon } from "../../components/Profileicon";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { openGroupsAtom } from "../../components/LCUConnector";
import { FriendDto, FriendGroup } from "../../types";
import { selectedFriendsAtom, useSelectedFriends } from "./useFriendList";
import { useAtomValue } from "jotai/utils";

export const FriendGroupRow = ({ group }: { group: FriendGroup }) => {
    const [openGroups, setOpenGroups] = useAtom(openGroupsAtom);
    const defaultIsOpen = useMemo(() => openGroups.includes(group.groupId), []);
    const selectedFriends = useAtomValue(selectedFriendsAtom);

    const { isOpen, onToggle } = useDisclosure({
        onOpen: () => {
            setOpenGroups((openGroups) => {
                if (openGroups.includes(group.groupId)) return openGroups;
                return [...openGroups, group.groupId];
            });
        },
        onClose: () => {
            setOpenGroups((openGroups) => {
                if (!openGroups.includes(group.groupId)) return openGroups;
                return openGroups.filter((groupId) => groupId !== group.groupId);
            });
        },
        defaultIsOpen,
    });

    const isChecked = useMemo(
        () => group.friends.every((friend) => selectedFriends.includes(friend.puuid)),
        [group, selectedFriends]
    );
    const isIndeterminate = useMemo(
        () => !isChecked && group.friends.some((friend) => selectedFriends.includes(friend.puuid)),
        [group, selectedFriends]
    );

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

export const FriendRow = ({ friend }: { friend: FriendDto }) => {
    const isChecked = useSelectedFriends(friend.puuid);

    const navigate = useNavigate();

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        sendMessage("friendList/select", {
            type: newState ? "add" : "remove",
            puuids: friend.puuid,
        });
    };

    return (
        <Flex pl="15px" alignItems="center" opacity={isChecked ? "1" : ".3"}>
            <Checkbox isChecked={isChecked} onChange={onChange} mr="10px" />
            <Flex
                alignItems="center"
                onClick={() => navigate(`/friend/${friend.puuid}`)}
                cursor="pointer"
            >
                <ProfileIcon icon={friend.icon} />
                <chakra.span pl="15px">{friend.name}</chakra.span>
            </Flex>
        </Flex>
    );
};
