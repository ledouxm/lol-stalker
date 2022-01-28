import { Box, BoxProps, chakra, Spinner } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { patchVersionAtom } from "../../components/LCUConnector";
import { Champion } from "../../types";
import { championsListAtom, getChampionIcon } from "./useChampionsList";

export const ChampionIcon = ({
    image,
    ...props
}: { image: Champion["image"]["full"] } & BoxProps) => {
    const patchVersion = useAtomValue(patchVersionAtom);
    const championsList = useAtomValue(championsListAtom);

    if (!patchVersion || !championsList)
        return (
            <Box boxSize="80px" {...props}>
                <Spinner />
            </Box>
        );

    const src = getChampionIcon(patchVersion, image);

    return <chakra.img boxSize="80px" src={src} {...props} />;
};
