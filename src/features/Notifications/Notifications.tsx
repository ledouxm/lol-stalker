import { Box, Flex, Spinner, Stack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef } from "react";
import { NotificationDto } from "../../types";
import { NotificationItem } from "./NotificationItem";
import { NotificationsFilters } from "./NotificationsFilters";
import { useNotificationsQueries } from "./useNotificationsQueries";

export const Notifications = () => {
    const { notificationsQuery, nbNewNotifications } = useNotificationsQueries();
    if (notificationsQuery.isError) return <Box>An error has occured</Box>;

    const notificationPages = notificationsQuery.data?.pages;
    const hasData = notificationPages?.every((arr) => !!arr.nextCursor);
    console.log({ hasData });
    console.log(notificationsQuery);
    return (
        <Flex h="100%">
            <Stack minW="150px" px="10px" h="100%" mt="10px">
                <NotificationsFilters />
            </Stack>
            {notificationsQuery.isLoading ? (
                <Spinner />
            ) : (
                <Stack ml="10px" overflowY="auto" height="100%" w="100%" overflowX="hidden">
                    {nbNewNotifications && nbNewNotifications > 0 && (
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
                            {nbNewNotifications} new notification(s), click to update
                        </Box>
                    )}
                    <NotificationContent
                        hasData={!!hasData}
                        notificationPages={notificationPages!}
                        fetchNextPage={notificationsQuery.fetchNextPage}
                    />
                </Stack>
            )}
        </Flex>
    );
};

export const NotificationContent = ({
    hasData,
    notificationPages,
    fetchNextPage,
}: {
    hasData: boolean;
    notificationPages:
        | ({
              content: NotificationDto[];
          } & {
              nextCursor: number;
          })[];
    fetchNextPage: () => void;
}) => {
    return (
        <>
            {hasData ? (
                notificationPages!.map((page, index, arr) => (
                    <NotificationItemPage
                        key={index}
                        notifications={page.content}
                        isLastPage={index === arr.length - 1}
                        fetchNextPage={fetchNextPage}
                    />
                ))
            ) : (
                <Box textAlign="center" mt="10px">
                    No notification
                </Box>
            )}
        </>
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

export const formatTooltipLabel = (notification: NotificationDto) =>
    `${notification.from} -> ${notification.to}`;
