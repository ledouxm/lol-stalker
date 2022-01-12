import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
// console.log(https.Agent);
export const LCUConnector = () => {
    const [authData, setAuthData] = useState(null as any);
    useEffect(() => {
        window.Main.on("lcu/connection", (data: any) => {
            if (!data) {
                console.log("disconnected");
                return setAuthData(null);
            }
            setAuthData(data);
            console.log("connected", data);

            const resp = axios
                .get(
                    `${data.protocol}://${data.username}:${data.password}@${data.address}:${data.port}/lol-summoner/v1/current-summoner`,
                    {
                        headers: { Authorization: `Basic ${data.password}` },
                        // httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                    }
                )
                .then(console.log)
                .catch(console.error);
        });

        window.ipcRenderer.send("lcu/connection");
    }, []);

    return <div>salut à tous</div>;
};
