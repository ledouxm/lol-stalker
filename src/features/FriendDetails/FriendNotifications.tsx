import { Box, Spinner, Stack } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { FriendDto, NotificationDto } from "../../types";
import { electronRequest } from "../../utils";
import { NotificationItem } from "../Notifications/NotificationItem";

const getFriendsNotifications = (puuid: FriendDto["puuid"]) =>
    electronRequest<NotificationDto[]>("notifications/friend", puuid);

export const FriendNotifications = ({ puuid }: Pick<FriendDto, "puuid">) => {
    const query = useQuery(["friendNotifications", puuid], () => getFriendsNotifications(puuid));

    if (query.isLoading) return <Spinner />;
    if (query.isError) return <Box>An error has occured</Box>;

    const notifications = query.data!;

    return (
        <Stack h="100%" overflowY="auto" w="100%">
            {notifications.map((notif) => (
                <NotificationItem
                    notification={notif}
                    key={notif.id}
                    isClickable={false}
                    withIcon={false}
                />
            ))}
        </Stack>
    );
};
