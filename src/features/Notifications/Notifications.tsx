import { Box, Flex, Spinner, Stack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { electronRequest } from "../../utils";
import { useAtomValue } from "jotai/utils";
import { friendsAtom } from "../FriendList/useFriendList";
import { FriendDto } from "../../types";

const getNotifications = () => electronRequest<NotificationObject[]>("notifications");
export const Notifications = () => {
    const notificationsQuery = useQuery("notifications", getNotifications);
    const friends = useAtomValue(friendsAtom);

    if (notificationsQuery.isLoading) return <Spinner />;
    if (notificationsQuery.error) return <Box>An error has occured</Box>;
    const baseNotifications = notificationsQuery.data!;

    const notifications = friends
        ? baseNotifications.filter(
              (notif) => friends.find((friend) => friend.puuid === notif.puuid)?.selected
          )
        : baseNotifications;

    return (
        <Stack>
            {notifications.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} />
            ))}
        </Stack>
    );
};

const NotificationItem = ({ notification }: { notification: NotificationObject }) => {
    return (
        <Flex flexDir="column" alignItems="flex-end" pr="10px">
            <Flex justifyContent="flex-end">
                <Box fontWeight="bold">{notification.friend.name}</Box>
                <Box ml="10px">{notification.content}</Box>
            </Flex>
            <Box fontSize="small" color="gray">
                {notification.createdAt?.toLocaleDateString()}{" "}
                {notification.createdAt?.toLocaleTimeString()}
            </Box>
        </Flex>
    );
};

export interface NotificationObject {
    id: number;
    content: string;
    puuid: string;
    friend: Partial<FriendDto>;
    createdAt?: Date;
}
