import { Box, BoxProps, chakra, Spinner } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { patchVersionAtom } from "../../components/LCUConnector";
import { SummonerSpell } from "../../types";
import { getSummonerSpellIcon, summonerSpellsListAtom } from "./useSummonerSpellsList";

export const SummonerSpellIcon = ({
    image,
    ...props
}: { image: SummonerSpell["image"]["full"] } & BoxProps) => {
    const patchVersion = useAtomValue(patchVersionAtom);
    const summonerSpells = useAtomValue(summonerSpellsListAtom);

    if (!patchVersion || !summonerSpells)
        return (
            <Box boxSize="80px" {...props}>
                <Spinner />
            </Box>
        );

    const src = getSummonerSpellIcon(patchVersion, image);
    return <chakra.img boxSize="30px" src={src} {...props} />;
};
