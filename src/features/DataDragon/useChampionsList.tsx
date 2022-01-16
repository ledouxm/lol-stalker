import axios from "axios";
import { atom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { useQuery } from "react-query";
import { patchVersionAtom } from "../../components/LCUConnector";
import { Champion } from "../../types";

export const championsListAtom = atom<any>(null as unknown as any);
export const useChampionsList = () => {
    const patchVersion = useAtomValue(patchVersionAtom);
    const setChampionsList = useUpdateAtom(championsListAtom);
    useQuery("championsList", () => getChampionsList(patchVersion), {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60,
        enabled: !!patchVersion,
        onSuccess: (data) => setChampionsList(data),
    });
};

export const useChampionDataById = (championId: number) => {
    const championsList = useAtomValue(championsListAtom);
    if (!championsList) return null;

    const champions = Object.values(championsList.data);
    return champions.find((champion: any) => champion.key === championId.toString()) as Champion;
};

export const getChampionIcon = (patchVersion: string, championImage: Champion["name"]) =>
    `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${championImage}`;
export const getChampionsList = async (patchVersion: string) =>
    (
        await axios.get(
            `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/data/en_US/champion.json`
        )
    ).data;
