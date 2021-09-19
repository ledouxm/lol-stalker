import { Stack } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { atom, useAtom } from "jotai";
import { atomWithStorage, useAtomValue } from "jotai/utils";
import React, { useRef } from "react";
import { ReactNode, useEffect, useState } from "react";
import {
    makeClickOnTypePicker,
    makeMouseMoveOnMap,
    makePickRessource,
    makeZoomChangeOnMap,
} from "./mock.js";

export const positionAtom = atom({ x: 0, y: 0 });
const positionRef = { current: { x: 0, y: 0 } };
export const Socket = ({ children }: { children?: ReactNode }) => {
    const [position, setPosition] = useAtom(positionAtom);
    useEffect(() => {
        const server = new WebSocket("ws://localhost:8080");

        server.onmessage = (e) => {
            const [event, data] = JSON.parse(e.data);

            if (event === "position") {
                positionRef.current.x = data.x;
                positionRef.current.y = data.y;
                setPosition(data);
            }
        };

        return () => server.close();
    }, []);

    return null;
};

const replaceInArray = (arr: any[], index: number, value: any) => {
    const clone = [...arr];
    clone[index] = value;
    return clone;
};

const ressourcesAtom = atomWithStorage("dofus/ressources", [-1, -1, -1]);
const playerMarker = { current: null };

interface IFrameWinwow extends Window {
    map: any;
    dofusXYToMapXY: any;
    getRectangleOnMapSize: any;
    L: any;
}

const drawRectangle = (contentWindow: IFrameWinwow, position?: { x: number; y: number }) => {
    if (playerMarker.current) contentWindow.map.removeLayer(playerMarker.current);
    const mapPos = contentWindow.dofusXYToMapXY(
        position?.x || positionRef.current.x,
        position?.y || positionRef.current.y
    );
    contentWindow.map.panTo(mapPos);

    const size = contentWindow.getRectangleOnMapSize();

    playerMarker.current = contentWindow.L.marker(mapPos, {
        interactive: false,
        icon: contentWindow.L.divIcon({
            className: "player",
            iconAnchor: [0, 0],
            iconSize: size,
        }),
    }).addTo(contentWindow.map);
    if (!position) return;
    positionRef.current.x = position.x;
    positionRef.current.y = position.y;
};

export const AppCanvas = () => {
    const [ressources, setRessources] = useAtom(ressourcesAtom);

    const isLoadedRef = useRef(false);

    useEffect(() => {
        const iframe = document.getElementById("targetFrame")! as HTMLIFrameElement;
        iframe.src = "https://dofus-map.com/";

        iframe.onload = function () {
            // console.log(iframe.contentWindow.setGroup);
            // @ts-ignore
            iframe.contentWindow.clickOnTypePicker = makeClickOnTypePicker((index) =>
                setRessources((ressources) => replaceInArray(ressources, index - 1, -1))
            ).bind(iframe);
            // @ts-ignore
            iframe.contentWindow.pickRessource = makePickRessource((val, index) => {
                setRessources((ressources) => replaceInArray(ressources, index - 1, val));
            }).bind(iframe);
            // @ts-ignore
            iframe.contentWindow.zoomChangeOnMap = makeZoomChangeOnMap((contentWindow) =>
                drawRectangle(contentWindow)
            ).bind(iframe);

            const { contentWindow } = document.getElementById("targetFrame")! as HTMLIFrameElement;
            const { document: doc } = contentWindow!;

            // leaflet-left
            const ressourcesPicker = doc.getElementById("ressourcesPicker")!;
            for (let i = 0; i < ressources.length; i++) {
                if (ressources[i] === -1) continue;
                ressourcesPicker.setAttribute("data-type", String(i + 1));

                const typeNode = doc.getElementById("pickRessource" + String(i + 1))!;
                typeNode.setAttribute("data-ressourceId", String(ressources[i]));

                // @ts-ignore
                contentWindow.pickRessource(typeNode);
            }
            doc.body.innerHTML =
                doc.body.innerHTML +
                `<style>
                    .player {
                        outline: 5px solid red;
                    }
                    #menu, .leaflet-control-container {
                        display: none;
                    }
                </style>`;

            isLoadedRef.current = true;
        };
    }, []);

    const position = useAtomValue(positionAtom);
    useEffect(() => {
        if (!isLoadedRef.current) return;
        const { contentWindow } = document.getElementById("targetFrame")! as HTMLIFrameElement;
        drawRectangle(contentWindow as IFrameWinwow, position);
    }, [position]);

    return (
        <Stack h="100vh">
            <iframe id="targetFrame" width="100%" height="100%"></iframe>
        </Stack>
    );
};
