import { Box, Center, Divider, Flex, Stack } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { BiTrash } from "react-icons/bi";
import { discordAuthAtom, socketStatusAtom } from "../../components/LCUConnector";
import { electronMutation } from "../../utils";
import { BotInfos } from "./BotInfos";
import { DiscordGuildList } from "./DiscordGuildList";
import { DiscordLoginButton } from "./DiscordLoginButton";

export const refreshGuilds = () => electronMutation("discord/guilds");
export const Discord = () => {
    const discordAuth = useAtomValue(discordAuthAtom);
    const socketStatus = useAtomValue(socketStatusAtom);

    if (socketStatus !== "connected") {
        return (
            <Center h="100%">
                <Box>Not connected to WS backend, try again later</Box>
            </Center>
        );
    }

    if (!discordAuth)
        return (
            <Center h="100%">
                <DiscordLoginButton />
            </Center>
        );
    return (
        <Stack h="100%">
            <Flex justifyContent="space-between" h="100%">
                <BotInfos flex="1" />
                <Divider orientation="vertical" h="70%" alignSelf="center" mr="10px" />
                <DiscordGuildList flex="2" />
            </Flex>
        </Stack>
    );
};
