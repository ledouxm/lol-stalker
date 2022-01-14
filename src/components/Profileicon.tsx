import { Box, BoxProps, chakra, Spinner } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { FriendDto } from "../types";
import { patchVersionAtom } from "./LCUConnector";

export const ProfileIcon = ({ icon, ...props }: { icon: FriendDto["icon"] } & BoxProps) => {
    const patchVersion = useAtomValue(patchVersionAtom);
    console.log(patchVersion);
    if (!patchVersion)
        return (
            <Box boxSize="50px" {...props}>
                <Spinner />
            </Box>
        );

    const src = getProfileIconUrl(patchVersion, icon);

    return <chakra.img boxSize="50px" borderRadius="50%" src={src} {...props} />;
};

export const getProfileIconUrl = (patchVersion: string, icon: FriendDto["icon"]) =>
    `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${icon}.png`;
