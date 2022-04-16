import { Button, Center, CenterProps, Icon } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { useEffect } from "react";
import { FaDiscord } from "react-icons/fa";
import { discordUrlsAtom } from "../../components/LCUConnector";
import { electronRequest } from "../../utils";

export const DiscordLoginButton = (props: CenterProps) => {
    const discordUrls = useAtomValue(discordUrlsAtom);

    useEffect(() => {
        if (!discordUrls) electronRequest("config/discord-urls");
    }, [discordUrls]);

    return (
        <Center flexDir="column" {...props}>
            <Icon as={FaDiscord} fontSize="120px" />
            <Button
                mt="10px"
                onClick={() => electronRequest("config/open-external", discordUrls?.authUrl)}
            >
                Log in with Discord
            </Button>
        </Center>
    );
};
