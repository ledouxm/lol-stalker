import { Box, Button, Center, Checkbox, Circle, Flex, Spinner, Stack } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { NotificationDto } from "../../types";
import { electronRequest } from "../../utils";
import { ProfileIcon } from "../DataDragon/Profileicon";
import { selectedFriendsAtom } from "../FriendList/useFriendList";

const getNotifications = (isNew?: boolean) =>
    electronRequest<NotificationDto[]>("notifications" + (isNew ? "/new" : "/"));

export const Notifications = () => {
    const [showRecent, setShowRecent] = useState(false);

    const notificationsQuery = useQuery(
        ["notifications", showRecent],
        () => getNotifications(showRecent),
        // showRecent
        //     ? window.notificationsApi.getNewNotifications()
        //     : window.notificationsApi.getNotifications(),
        { refetchInterval: false, refetchOnWindowFocus: false }
    );
    const selectedFriends = useAtomValue(selectedFriendsAtom);

    if (notificationsQuery.isError) return <Box>An error has occured</Box>;

    const baseNotifications = notificationsQuery.data!;

    const notifications = useMemo(
        () =>
            baseNotifications && selectedFriends
                ? baseNotifications.filter((notif) => selectedFriends.includes(notif.puuid))
                : baseNotifications,
        [baseNotifications, selectedFriends]
    );

    return (
        <Flex>
            <Stack minW="150px" px="10px" overflow="hidden">
                <Button
                    boxShadow="none !important"
                    variant={showRecent ? "solid" : "outline"}
                    bgColor={showRecent ? "blue.400" : "transparent"}
                    onClick={() => setShowRecent((old) => !old)}
                >
                    Show recent
                </Button>
                {/* <Checkbox pl="10px">Auto</Checkbox> */}
                <Button
                    bgColor="blue.400"
                    onClick={() => notifications && window.Main.sendMessage("notifications/setNew")}
                >
                    Archive
                </Button>
            </Stack>
            {notificationsQuery.isLoading ? (
                <Spinner />
            ) : (
                <Stack ml="10px" overflow="auto">
                    {notifications.map((notif) => (
                        <NotificationItem key={notif.id} notification={notif} />
                    ))}
                </Stack>
            )}
        </Flex>
    );
};

export const NotificationItem = ({
    notification,
    isClickable = true,
}: {
    notification: NotificationDto;
    isClickable?: boolean;
}) => {
    const navigate = useNavigate();

    return (
        <Flex w="700px">
            <ProfileIcon icon={notification.friend.icon} mr="10px" />
            <Flex flexDir="column" pr="10px">
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
            {notification.isNew && <Circle />}
        </Flex>
    );
};

const formatTooltipLabel = (notification: NotificationDto) =>
    `${notification.from} -> ${notification.to}`;
