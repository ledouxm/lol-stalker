import axios from "axios";
import { atom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { useQuery } from "react-query";
import { patchVersionAtom } from "../../components/LCUConnector";
import { Item } from "../../types";

export const itemsListAtom = atom<any>(null as unknown as any);
export const useItemsList = () => {
    const patchVersion = useAtomValue(patchVersionAtom);
    const setItemsList = useUpdateAtom(itemsListAtom);
    useQuery("itemsList", () => getItemsList(patchVersion), {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60,
        enabled: !!patchVersion,
        onSuccess: (data) => setItemsList(data),
    });
};

export const useItemsDataByIds = (itemIds: number[]) => {
    const itemsList = useAtomValue(itemsListAtom);
    if (!itemsList) return null;

    return itemIds.map((itemId) => itemsList.data[itemId.toString()]) as Item[];
};

export const getItemIcon = (patchVersion: string, itemImage: Item["name"]) =>
    `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/item/${itemImage}`;

export const getItemsList = async (patchVersion: string) =>
    (
        await axios.get(
            `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/data/en_US/item.json`
        )
    ).data;
