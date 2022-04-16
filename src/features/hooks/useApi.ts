import { useAtomValue } from "jotai/utils";
import { useEffect } from "react";
import { api } from "../../api";
import { discordAuthAtom } from "../../components/LCUConnector";

export const useApi = () => {
    const discordAuth = useAtomValue(discordAuthAtom);

    useEffect(() => {
        if (!discordAuth) return void (api.defaults.headers.common["authorization"] = "");
        api.defaults.headers.common["authorization"] = "Bearer " + discordAuth.access_token;
    }, [discordAuth]);

    return null;
};
