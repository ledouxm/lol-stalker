import { Box, chakra, Flex } from "@chakra-ui/react";
import { last } from "@pastable/core";
import { FriendDto } from "../../types";
import { ProfileIcon } from "../DataDragon/Profileicon";
import { formatRank } from "./FriendDetails";

export const Profile = ({ friend }: { friend: FriendDto }) => {
    if (!friend?.rankings) return null;
    const lastRanking = last(friend?.rankings);
    return (
        <Flex alignItems="center" justifyContent="center">
            <Flex alignItems="center">
                <ProfileIcon icon={friend.icon} />
                <Flex direction="column" ml="15px">
                    <Box fontSize="20px" fontWeight="bold">
                        {friend.name} <chakra.span color="gray.500">#{friend.gameTag}</chakra.span>
                    </Box>
                    {lastRanking && (
                        <Box color="gray.400" mt="-5px">
                            {formatRank(lastRanking)}
                        </Box>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};
