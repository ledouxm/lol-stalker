import { Box, BoxProps, chakra, Spinner } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { patchVersionAtom } from "../../components/LCUConnector";
import { Item } from "../../types";
import { getItemIcon, itemsListAtom } from "./useItemsList";

export const ItemIcon = ({ image, ...props }: { image?: Item["image"]["full"] } & BoxProps) => {
    const patchVersion = useAtomValue(patchVersionAtom);
    const items = useAtomValue(itemsListAtom);

    if (!image) return <Box boxSize="40px" {...props}></Box>;
    if (!patchVersion || !items)
        return (
            <Box boxSize="80px" {...props}>
                <Spinner />
            </Box>
        );

    const src = getItemIcon(patchVersion, image);
    return <chakra.img boxSize="40px" src={src} {...props} />;
};
