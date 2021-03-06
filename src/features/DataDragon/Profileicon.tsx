import { Box, BoxProps, Center, chakra, Spinner } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { patchVersionAtom } from "../../components/LCUConnector";
import { FriendDto } from "../../types";
import { getProfileIconUrl } from "./utils";

export const ProfileIcon = ({ icon, ...props }: { icon: FriendDto["icon"] } & BoxProps) => {
    const patchVersion = useAtomValue(patchVersionAtom);

    if (!patchVersion)
        return (
            <Center boxSize="50px" {...props}>
                <Spinner />
            </Center>
        );

    const src = getProfileIconUrl(patchVersion, icon);

    return <chakra.img boxSize="50px" borderRadius="50%" src={src} {...props} />;
};
