import { ChatIcon } from "@chakra-ui/icons";
import { Box, BoxProps, chakra, Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FriendDto, NotificationDto } from "../../types";
import { ProfileIcon } from "../DataDragon/Profileicon";
import { formatTooltipLabel } from "./Notifications";

export const NotificationItem = ({
    notification,
    isClickable = true,
    withIcon = true,
    friend,
}: {
    notification: NotificationDto;
    isClickable?: boolean;
    withIcon?: boolean;
    friend?: FriendDto;
}) => {
    const navigate = useNavigate();

    const isRed = ["LOSS", "DEMOTION"].includes(notification.type);
    return (
        <Flex mt="10px" width="700px">
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
                        onClick={() =>
                            isClickable && navigate(`/friend/${notification.friend.puuid}`)
                        }
                    >
                        {notification.isNew && withIcon && (
                            <Box boxSize="10px" bg="orange" borderRadius="50%" mr="5px" />
                        )}
                        {friend?.name || notification.friend.name}
                    </Flex>
                    <Flex ml="10px" alignItems="center">
                        <chakra.span color={isRed ? "red-loss" : "blue-win"}>
                            {formatNotificationContent(notification)}
                        </chakra.span>
                        {["DEMOTION", "LOSS"].includes(notification.type) && (
                            <Tooltip label="Send recorded message to this friend">
                                <IconButton
                                    aria-label="Send message"
                                    icon={<ChatIcon />}
                                    onClick={() =>
                                        window.Main.sendMessage("friendList/message", {
                                            summonerName: notification.friend.name,
                                        })
                                    }
                                    h="auto"
                                    py="6px"
                                    ml="10px"
                                />
                            </Tooltip>
                        )}
                    </Flex>
                </Flex>
                <Box fontSize="small" color="gray.400">
                    {formatTooltipLabel(notification)}
                </Box>
                <Box fontSize="small" color="gray">
                    {new Date(notification.createdAt).toLocaleDateString()}{" "}
                    {new Date(notification.createdAt).toLocaleTimeString()}
                </Box>
            </Flex>
        </Flex>
    );
};

const formatNotificationContent = (notification: NotificationDto) => {
    return notification.content.replace(" NA ", " ");
};

const TurkeyFlag = (props: BoxProps) => (
    <Box {...props}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" viewBox="0 -30000 90000 60000">
            <title>Flag of Turkey</title>
            <path fill="#e30a17" d="m0-30000h90000v60000H0z" />
            <path
                fill="#fff"
                d="m41750 0 13568-4408-8386 11541V-7133l8386 11541zm925 8021a15000 15000 0 1 1 0-16042 12000 12000 0 1 0 0 16042z"
            />
        </svg>
    </Box>
);
