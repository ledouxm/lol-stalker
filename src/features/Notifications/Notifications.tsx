import { InfoIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Center,
    Checkbox,
    Circle,
    Flex,
    Spinner,
    Stack,
    Tooltip,
} from "@chakra-ui/react";
import { omit } from "@pastable/core";
import { useAtom } from "jotai";
import { atomWithStorage, useAtomValue, useUpdateAtom } from "jotai/utils";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../components/Pagination";
import { NotificationDto } from "../../types";
import { electronRequest } from "../../utils";
import { ProfileIcon } from "../DataDragon/Profileicon";
import { selectedFriendsAtom } from "../FriendList/useFriendList";

const getNotifications = (
    isNew: boolean,
    paginationOptions: Partial<Pick<PaginationProps, "nbPerPage" | "page">> = {}
) =>
    electronRequest<{ content: NotificationDto[] } & PaginationProps>(
        "notifications" + (isNew ? "/new" : ""),
        paginationOptions
    );

interface PaginationProps {
    count: number;
    nbPerPage: number;
    page: number;
    nbPages: number;
}
const optionsAtom = atomWithStorage("lol-stalking/options", { showRecent: false, showAll: false });
export const Notifications = () => {
    const [page, setPage] = useState(0);
    const [options, setOptions] = useAtom(optionsAtom);

    const { showRecent, showAll } = options;
    const setShowRecent = (showRecent: boolean) =>
        setOptions((options) => ({ ...options, showRecent }));
    const setShowAll = (showAll: boolean) => setOptions((options) => ({ ...options, showAll }));

    const notificationsQuery = useQuery(
        ["notifications", showRecent, page],
        () => getNotifications(showRecent, { page }),
        { refetchInterval: false, refetchOnWindowFocus: false }
    );
    const selectedFriends = useAtomValue(selectedFriendsAtom);

    if (notificationsQuery.isError) return <Box>An error has occured</Box>;

    const baseNotifications = notificationsQuery.data?.content;
    const paginationProps = notificationsQuery.data && omit(notificationsQuery.data, ["content"]);

    const notifications = useMemo(() => {
        if (!baseNotifications) return null;
        if (showAll) return baseNotifications;
        return baseNotifications.filter((notif) => selectedFriends.includes(notif.puuid));
    }, [baseNotifications, selectedFriends, showAll]);

    return (
        <Flex h="100%">
            <Stack minW="150px" px="10px" h="100%" mt="10px">
                <Checkbox
                    boxShadow="none !important"
                    onChange={(state) => setShowRecent(state.target.checked)}
                    isChecked={showRecent}
                >
                    Recent
                </Checkbox>
                <Checkbox
                    boxShadow="none !important"
                    onChange={(state) => setShowAll(state.target.checked)}
                    isChecked={showAll}
                >
                    <Flex alignItems="center">
                        Show all
                        <Tooltip label="You can unselect friends in the Friendlist tab">
                            <InfoIcon ml="10px" />
                        </Tooltip>
                    </Flex>
                </Checkbox>
                <Button
                    boxShadow="none !important"
                    bgColor="blue.400"
                    onClick={() => notifications && window.Main.sendMessage("notifications/setNew")}
                >
                    Archive
                </Button>
            </Stack>
            {notificationsQuery.isLoading ? (
                <Spinner />
            ) : (
                <Stack ml="10px" overflowY="auto" height="100%" w="100%">
                    {notifications!.map((notif) => (
                        <NotificationItem key={notif.id} notification={notif} />
                    ))}
                    <Center>
                        <Pagination
                            pageIndex={paginationProps!.page}
                            pageCount={paginationProps!.nbPages}
                            goToPage={setPage}
                        />
                    </Center>
                </Stack>
            )}
        </Flex>
    );
};

export const NotificationItem = ({
    notification,
    isClickable = true,
    withIcon = true,
}: {
    notification: NotificationDto;
    isClickable?: boolean;
    withIcon?: boolean;
}) => {
    const navigate = useNavigate();

    return (
        <Flex pos="relative" mt="10px">
            {withIcon && <ProfileIcon icon={notification.friend.icon} mr="10px" />}
            <Flex whiteSpace="nowrap" flexDir="column" pr="10px">
                <Flex>
                    <Box
                        fontWeight="bold"
                        _hover={{
                            textDecoration: isClickable ? "underline" : "initial",
                        }}
                        cursor={isClickable ? "pointer" : "initial"}
                        onClick={() => isClickable && navigate(`/friend/${notification.puuid}`)}
                    >
                        {notification.friend.name}
                    </Box>
                    <Box ml="10px">{notification.content}</Box>
                </Flex>
                <Box fontSize="small" color="gray.400">
                    {formatTooltipLabel(notification)}
                </Box>
                <Box fontSize="small" color="gray">
                    {notification.createdAt?.toLocaleDateString()}{" "}
                    {notification.createdAt?.toLocaleTimeString()}
                </Box>
            </Flex>
            {notification.isNew && withIcon && (
                <Box pos="absolute" boxSize="10px" bg="orange" borderRadius="50%" />
            )}
        </Flex>
    );
};

const formatTooltipLabel = (notification: NotificationDto) =>
    `${notification.from} -> ${notification.to}`;
