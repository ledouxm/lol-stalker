import axios from "axios";
import { atom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { useQuery } from "react-query";
import { patchVersionAtom } from "../../components/LCUConnector";
import { Participant, SummonerSpell } from "../../types";

export const summonerSpellsListAtom = atom<any>(null as unknown as any);
export const useSummonerSpellsList = () => {
    const patchVersion = useAtomValue(patchVersionAtom);
    const setSummonerSpellsList = useUpdateAtom(summonerSpellsListAtom);
    useQuery("summonerSpellsList", () => getSummonerSpellsList(patchVersion), {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60,
        enabled: !!patchVersion,
        onSuccess: (data) => setSummonerSpellsList(data),
    });
};

export const useSummonerSpellsDataByIds = (spellIds: Participant["spell1Id"][]) => {
    const summonerSpellsList = useAtomValue(summonerSpellsListAtom);
    if (!summonerSpellsList) return [];

    const summonerSpells = Object.values(summonerSpellsList.data);
    return spellIds.map((spellId) =>
        summonerSpells.find((champion: any) => champion.key === spellId.toString())
    ) as SummonerSpell[];
};

export const getSummonerSpellIcon = (
    patchVersion: string,
    summonerSpellImage: SummonerSpell["image"]["full"]
) => `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/spell/${summonerSpellImage}`;

export const getSummonerSpellsList = async (patchVersion: string) =>
    (
        await axios.get(
            `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/data/en_US/summoner.json`
        )
    ).data;
