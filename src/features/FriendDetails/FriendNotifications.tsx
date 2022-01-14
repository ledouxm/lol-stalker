import { Box, Spinner, Stack } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { FriendDto } from "../../../electron/LCU/types";
import { NotificationDto } from "../../types";
import { electronRequest } from "../../utils";
import { NotificationItem } from "../Notifications/Notifications";

const getFriendsNotifications = (puuid: FriendDto["puuid"]) =>
    electronRequest<NotificationDto[]>("notifications/friend", puuid);

export const FriendNotifications = ({ puuid }: Pick<FriendDto, "puuid">) => {
    const query = useQuery(["friendNotifications", puuid], () => getFriendsNotifications(puuid));

    if (query.isLoading) return <Spinner />;
    if (query.isError) return <Box>An error has occured</Box>;

    const notifications = query.data!;
    console.log(notifications);
    return (
        <Stack>
            {notifications.map((notif) => (
                <NotificationItem notification={notif} key={notif.id} isClickable={false} />
            ))}
        </Stack>
    );
};