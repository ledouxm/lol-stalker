import { Box, Center } from "@chakra-ui/react";
import { FriendDto } from "../../types";
import { NotificationItem } from "../Notifications/NotificationItem";

export const FriendNotifications = ({ friend }: { friend: FriendDto }) => {
    const { notifications } = friend;
    if (!notifications?.length)
        return (
            <Center w="100%">
                <Box>No notification</Box>
            </Center>
        );

    return (
        <Center flexDir="column" h="100%" overflowY="auto" w="100%" justifyContent="flex-start">
            {notifications.map((notif) => (
                <NotificationItem
                    friend={friend}
                    notification={notif}
                    key={notif.id}
                    isClickable={false}
                    withIcon={false}
                />
            ))}
        </Center>
    );
};
