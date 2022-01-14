import { Flex } from "@chakra-ui/react";
import { FriendList } from "./features/FriendList/FriendList";
import { Notifications } from "./features/Notifications/Notifications";

export const Home = () => {
    return (
        <Flex justifyContent="space-between">
            <FriendList />
            <Notifications />
        </Flex>
    );
};
