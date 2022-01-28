import { Box, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { NotificationDto } from "../../types";
import { ProfileIcon } from "../DataDragon/Profileicon";
import { formatTooltipLabel } from "./Notifications";

export const NotificationItem = ({
    notification,
    isClickable = true,
    withIcon = true,
}: {
    notification: NotificationDto;
    isClickable?: boolean;
    withIcon?: boolean;
}) => {
    const navigate = useNavigate();

    const isRed = ["LOSS", "DEMOTION"].includes(notification.type);

    return (
        <Flex mt="10px">
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
                        onClick={() => isClickable && navigate(`/friend/${notification.puuid}`)}
                    >
                        {notification.isNew && withIcon && (
                            <Box boxSize="10px" bg="orange" borderRadius="50%" mr="5px" />
                        )}
                        {notification.friend.name}
                    </Flex>
                    <Box ml="10px" color={isRed ? "red-loss" : "blue-win"}>
                        {notification.content.replace(" NA ", " ")}
                    </Box>
                </Flex>
                <Box fontSize="small" color="gray.400">
                    {formatTooltipLabel(notification)}
                </Box>
                <Box fontSize="small" color="gray">
                    {notification.createdAt?.toLocaleDateString()}{" "}
                    {notification.createdAt?.toLocaleTimeString()}
                </Box>
            </Flex>
        </Flex>
    );
};
