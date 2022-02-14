import {
    Box,
    BoxProps,
    Center,
    chakra,
    Divider,
    Flex,
    Icon,
    IconButton,
    ListItem,
    Spinner,
    UnorderedList,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { BiLogOut } from "react-icons/bi";
import { FaDiscord } from "react-icons/fa";
import { meAtom } from "../../components/LCUConnector";
import { electronMutation } from "../../utils";
import { BotInvitation } from "./BotInvitation";
import { useGuildsQuery } from "./DiscordGuildList";

export const BotInfos = (props: BoxProps) => {
    const guildsQuery = useGuildsQuery();
    const me = useAtomValue(meAtom);
    if (guildsQuery.isLoading)
        return (
            <Center w="100%" h="100%">
                <Spinner />
            </Center>
        );
    if (guildsQuery.isError)
        return (
            <Center w="100%" h="100%">
                An error has occured
            </Center>
        );

    const guilds = guildsQuery.data;

    return (
        <Center
            flexDir="column"
            justifyContent="space-between"
            w="100%"
            h="100%"
            padding="10px"
            px="20px"
            {...props}
        >
            <Flex flexDir="column">
                {me && (
                    <Flex alignItems="center">
                        <Icon as={FaDiscord} fontSize="50px" />
                        <Flex direction="column" ml="20px" fontSize="18px">
                            <chakra.span fontSize="15px">Connected as</chakra.span>
                            <chakra.span fontWeight="600">
                                {me.username} <chakra.span>#{me.discriminator}</chakra.span>
                            </chakra.span>
                        </Flex>
                        <IconButton
                            ml="10px"
                            onClick={() => electronMutation("store/set", { discordAuth: null })}
                            icon={<BiLogOut size="20px" />}
                            aria-label="Logout"
                        />
                    </Flex>
                )}
                <Divider mt="15px" mb="20px" />
                <Box textAlign="center">
                    The bot is active on <b>{guilds?.length || 0}</b> of your servers
                </Box>
                <Divider my="20px" />
                <UnorderedList spacing="10px">
                    <ListItem>Invite the bot to your Discord server</ListItem>
                    <ListItem>
                        Send <chakra.span fontWeight="600">!stalker init</chakra.span> in the
                        channel you want the bot to send messages in
                    </ListItem>
                    <ListItem>
                        <Flex alignItems="center">Add stalked summoners to the list</Flex>
                    </ListItem>
                </UnorderedList>
            </Flex>
            <BotInvitation />
        </Center>
    );
};
