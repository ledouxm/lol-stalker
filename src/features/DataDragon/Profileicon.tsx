import { Box, BoxProps, chakra, Spinner } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { FriendDto, Stats } from "../../types";
import { getProfileIconUrl } from "./utils";
import { patchVersionAtom } from "../../components/LCUConnector";

export const ProfileIcon = ({ icon, ...props }: { icon: FriendDto["icon"] } & BoxProps) => {
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
