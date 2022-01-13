import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { atom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
// console.log(https.Agent);
export const LCUConnector = () => {
    useEffect(() => {
        window.Main.on("lcu/connection", (data: any) => {});

        window.ipcRenderer.send("lcu/connection");
    }, []);

    usePatchVersion();
    return null;
};

export const patchVersionAtom = atom<string>(null as unknown as string);
export const usePatchVersion = () => {
    const setPatchVersion = useUpdateAtom(patchVersionAtom);
    useQuery("version", getDataDragonVersion, {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60,
        onSuccess: (data) => setPatchVersion(data),
    });
};

export const getDataDragonVersion = async () =>
    (await axios.get("https://ddragon.leagueoflegends.com/api/versions.json")).data[0];
