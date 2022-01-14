import { Box, Flex, Spinner, Stack, Tooltip } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { NotificationDto } from "../../types";
import { electronRequest } from "../../utils";
import { selectedFriendsAtom } from "../FriendList/useFriendList";

const getNotifications = () => electronRequest<NotificationDto[]>("notifications");
export const Notifications = () => {
    const notificationsQuery = useQuery("notifications", getNotifications);
    const selectedFriends = useAtomValue(selectedFriendsAtom);

    if (notificationsQuery.isLoading) return <Spinner />;
    if (notificationsQuery.error) return <Box>An error has occured</Box>;

    const baseNotifications = notificationsQuery.data!;

    const notifications = selectedFriends
        ? baseNotifications.filter((notif) => selectedFriends.includes(notif.puuid))
        : baseNotifications;

    return (
        <Stack>
            {notifications.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} />
            ))}
        </Stack>
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
        <Tooltip label={formatTooltipLabel(notification)}>
            <Flex flexDir="column" alignItems="flex-end" pr="10px">
                <Flex justifyContent="flex-end">
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
                <Box fontSize="small" color="gray">
                    {notification.createdAt?.toLocaleDateString()}{" "}
                    {notification.createdAt?.toLocaleTimeString()}
                </Box>
            </Flex>
        </Tooltip>
    );
};

const formatTooltipLabel = (notification: NotificationDto) =>
    `${notification.from} -> ${notification.to}`;
