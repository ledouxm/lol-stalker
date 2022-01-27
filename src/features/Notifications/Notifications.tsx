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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../components/Pagination";
import { NotificationDto } from "../../types";
import { electronRequest } from "../../utils";
import { ProfileIcon } from "../DataDragon/Profileicon";
import { selectedFriendsAtom } from "../FriendList/useFriendList";

const getNotifications = (data: { pageParam?: number }) =>
    electronRequest<{ content: NotificationDto[] } & { nextCursor: number }>("notifications/all", {
        cursor: data.pageParam,
    });
const getNbNewNotifications = (currentMaxId: number) =>
    electronRequest("notifications/nb-new", { currentMaxId });
const optionsAtom = atomWithStorage("lol-stalking/options", { showRecent: false, showAll: false });

export const Notifications = () => {
    const [options, setOptions] = useAtom(optionsAtom);
    const { showRecent, showAll } = options;
    const setShowRecent = (showRecent: boolean) =>
        setOptions((options) => ({ ...options, showRecent }));
    const setShowAll = (showAll: boolean) => setOptions((options) => ({ ...options, showAll }));

    const notificationsQuery = useInfiniteQuery("notifications/all", getNotifications, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

    const currentMaxId =
        notificationsQuery.data?.pages.length &&
        Math.max(
            ...notificationsQuery.data?.pages.map((page) =>
                Math.max(...page.content.map((notif) => notif.id))
            )
        );

    const newNotificationsQuery = useQuery(
        ["notifications/nb-new", currentMaxId],
        () => getNbNewNotifications(currentMaxId!),
        {
            enabled: !!currentMaxId,
            refetchInterval: false,
            refetchOnWindowFocus: false,
        }
    );

    const diffNbNotifs = useMemo(() => {
        if (newNotificationsQuery.isLoading || newNotificationsQuery.isError) return null;
        const nb = newNotificationsQuery.data;
        return nb - currentMaxId!;
    }, [newNotificationsQuery, currentMaxId]);

    if (notificationsQuery.isError) return <Box>An error has occured</Box>;
    console.log(diffNbNotifs);

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
                <Button boxShadow="none !important" bgColor="blue.400">
                    Archive
                </Button>
            </Stack>
            {notificationsQuery.isLoading ? (
                <Spinner />
            ) : (
                <Stack ml="10px" overflowY="auto" height="100%" w="100%" overflowX="hidden">
                    {diffNbNotifs && diffNbNotifs > 0 && (
                        <Box
                            onClick={() => notificationsQuery.refetch()}
                            w="100%"
                            textAlign="center"
                            bgColor="blue.500"
                            py="10px"
                            borderRadius="10px 10px 0 0"
                            fontWeight="medium"
                            cursor="pointer"
                        >
                            {diffNbNotifs} new notification(s), click to update
                        </Box>
                    )}
                    {notificationsQuery.data?.pages.map((page, index, arr) => (
                        <NotificationItemPage
                            key={index}
                            notifications={page.content}
                            isLastPage={index === arr.length - 1}
                            fetchNextPage={notificationsQuery.fetchNextPage}
                        />
                    ))}
                    {/* {notifications!.map((notif) => (
                        <NotificationItem key={notif.id} notification={notif} />
                    ))} */}
                </Stack>
            )}
        </Flex>
    );
};

export const NotificationItemPage = ({
    notifications,
    fetchNextPage,
    isLastPage,
}: {
    notifications: NotificationDto[];
    fetchNextPage: () => void;
    isLastPage: boolean;
}) => {
    const containerRef = useRef(null);

    const callbackFn = useCallback(
        (data: IntersectionObserverEntry[]) => data[0].isIntersecting && fetchNextPage(),
        []
    );

    useEffect(() => {
        const observer = new IntersectionObserver(callbackFn, {
            root: null,
            rootMargin: "0px",
            threshold: 1,
        });
        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            if (!containerRef.current) return;
            observer.unobserve(containerRef.current);
        };
    }, []);

    return (
        <>
            {notifications.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} />
            ))}
            {isLastPage && <Box ref={containerRef} h="50px" />}
        </>
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

    const isRed = ["LOSS", "DEMOTION"].includes(notification.type);

    return (
        <Flex mt="10px">
            {withIcon && <ProfileIcon icon={notification.friend.icon} mr="10px" />}
            <Flex whiteSpace="nowrap" flexDir="column" pr="10px">
                <Flex>
                    <Flex
                        alignItems="center"
                        fontWeight="bold"
                        _hover={{
                            textDecoration: isClickable ? "underline" : "initial",
                        }}
                        cursor={isClickable ? "pointer" : "initial"}
                        onClick={() => isClickable && navigate(`/friend/${notification.puuid}`)}
                    >
                        {notification.isNew && withIcon && (
                            <Box boxSize="10px" bg="orange" borderRadius="50%" mr="5px" />
                        )}
                        {notification.friend.name}
                    </Flex>
                    <Box ml="10px" color={isRed ? "red-loss" : "blue-win"}>
                        {notification.content.replace(" NA ", " ")}
                    </Box>
                </Flex>
                <Box fontSize="small" color="gray.400">
                    {formatTooltipLabel(notification)}
                </Box>
                <Box fontSize="small" color="gray">
                    {notification.createdAt?.toLocaleDateString()}{" "}
                    {notification.createdAt?.toLocaleTimeString()}
                </Box>
            </Flex>
        </Flex>
    );
};

const formatTooltipLabel = (notification: NotificationDto) =>
    `${notification.from} -> ${notification.to}`;
