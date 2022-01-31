import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    chakra,
    Checkbox,
    Flex,
    FlexProps,
    Stack,
    useDisclosure,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import { ChangeEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { openGroupsAtom } from "../../components/LCUConnector";
import { FriendDto, FriendGroup } from "../../types";
import { sendMessage } from "../../utils";
import { ProfileIcon } from "../DataDragon/Profileicon";
import { selectedFriendsAtom } from "./useFriendList";

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
        <AccordionItem>
            <AccordionButton alignItems="center">
                <Checkbox
                    isChecked={isChecked}
                    isIndeterminate={isIndeterminate}
                    onChange={onChange}
                />
                <chakra.span
                    ml="10px"
                    textTransform="uppercase"
                    fontWeight="bold"
                    cursor="pointer"
                    userSelect="none"
                >
                    {group.groupName} ({group.friends.length})
                </chakra.span>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
                {group.friends
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((friend) => (
                        <FriendRow
                            key={friend.puuid}
                            friend={friend}
                            isChecked={selectedFriends.includes(friend.puuid)}
                            mb="10px"
                        />
                    ))}
            </AccordionPanel>
        </AccordionItem>
    );
};

export const FriendRow = ({
    friend,
    isChecked,
    ...props
}: { friend: FriendDto; isChecked: boolean } & FlexProps) => {
    const navigate = useNavigate();

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newState = e.target.checked;
        sendMessage("friendList/select", {
            type: newState ? "add" : "remove",
            puuids: friend.puuid,
        });
    };

    return (
        <Flex alignItems="center" opacity={isChecked ? "1" : ".3"} {...props}>
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
