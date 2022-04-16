import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, Center, CenterProps } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { discordUrlsAtom } from "../../components/LCUConnector";
import { electronRequest } from "../../utils";

export const BotInvitation = (props: CenterProps) => {
    const discordUrls = useAtomValue(discordUrlsAtom);

    if (!discordUrls) return <Box />;

    return (
        <Center {...props}>
            <Button onClick={() => electronRequest("config/open-external", discordUrls.inviteUrl)}>
                Invite the bot
                <ExternalLinkIcon ml="7px" />
            </Button>
            <Button ml="10px" onClick={() => navigator.clipboard.writeText(discordUrls.inviteUrl)}>
                Copy invite url
            </Button>
        </Center>
    );
};
