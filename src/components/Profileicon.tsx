import { Box, BoxProps, chakra, Spinner } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { patchVersionAtom } from "./LCUConnector";
import { FriendClient } from "../features/FriendList/FriendList";

export const ProfileIcon = ({ icon, ...props }: { icon: FriendClient["icon"] } & BoxProps) => {
    const patchVersion = useAtomValue(patchVersionAtom);

    if (!patchVersion)
        return (
            <Box boxSize="50px" {...props}>
                <Spinner />
            </Box>
        );

    const src = getProfileIconUrl(patchVersion, icon);

    return <chakra.img boxSize="50px" borderRadius="50%" src={src} {...props} />;
};

export const getProfileIconUrl = (patchVersion: string, icon: FriendClient["icon"]) =>
    `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${icon}.png`;
