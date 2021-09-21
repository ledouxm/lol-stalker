import {
    Box,
    BoxProps,
    Center,
    chakra,
    CloseButton,
    DarkMode,
    Flex,
    Icon,
    Modal,
    ModalCloseButton,
    ModalContent,
    Stack,
    useDisclosure,
    useModal,
} from "@chakra-ui/react";
import { atom, useAtom } from "jotai";
import { atomWithStorage, useAtomValue, useUpdateAtom } from "jotai/utils";
import React, { useRef, useState } from "react";
import { ReactNode, useEffect } from "react";
import { makeClickOnTypePicker, makePickRessource, makeZoomChangeOnMap } from "./mock.js";
import { RiCloseFill, RiSettings5Fill } from "react-icons/ri";
import { makeArrayOf } from "@pastable/utils";
import spriteMap from "../spriteMap.png";
import { getRessourceById, ressources as ressourcesData, metiers } from "./ressources";

export const positionAtom = atomWithStorage("dofus/position", { x: 0, y: 0 });
const positionRef = { current: { x: 0, y: 0 } };
export const Socket = ({ children }: { children?: ReactNode }) => {
    const setPosition = useUpdateAtom(positionAtom);

    useEffect(() => {
        window.Main.on("position", (payload: string) => {
            const position = JSON.parse(payload);
            positionRef.current.x = position.x;
            positionRef.current.y = position.y;
            console.log(position);
            setPosition(position as any);
        });
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

interface IFrameWindow extends Window {
    map: any;
    dofusXYToMapXY: any;
    getRectangleOnMapSize: any;
    L: any;
}

const drawRectangle = ({
    contentWindow,
    position,
    center,
}: {
    contentWindow: IFrameWindow;
    position?: { x: number; y: number };
    center?: boolean;
}) => {
    if (playerMarker.current) contentWindow.map.removeLayer(playerMarker.current);
    const mapPos = contentWindow.dofusXYToMapXY(
        position?.x || positionRef.current.x,
        position?.y || positionRef.current.y
    );
    if (center) contentWindow.map.panTo(mapPos);

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

const injectRessource = (index: number, ressource?: typeof ressourcesData[0]) => {
    const contentWindow = getContentWindow();
    const doc = contentWindow.document;

    const ressourcesPicker = doc.getElementById("ressourcesPicker")!;
    ressourcesPicker.setAttribute("data-type", String(index + 1));

    console.log("injecting", index, ressource);

    const typeNode = doc.getElementById("pickRessource" + String(index + 1))!;
    if (ressource) {
        typeNode.setAttribute("data-ressourceId", String(ressource.id));
        typeNode.setAttribute("data-name", String(ressource.name));
        // @ts-ignore
        contentWindow.pickRessource(typeNode);
    } else {
        typeNode.removeAttribute("data-ressourceId");
        // @ts-ignore
        contentWindow.removeRessourceMarkers(index + 1);
    }
};

const getContentWindow = () => {
    return (document.getElementById("targetFrame") as HTMLIFrameElement)!
        .contentWindow as IFrameWindow;
};

export const AppCanvas = () => {
    const [ressources, setRessources] = useAtom(ressourcesAtom);

    const isLoadedRef = useRef(false);

    useEffect(() => {
        const iframe = document.getElementById("targetFrame")! as HTMLIFrameElement;
        iframe.src = "https://dofus-map.com/";

        iframe.onload = function () {
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
                drawRectangle({ contentWindow, center: false })
            ).bind(iframe);

            // @ts-ignore
            iframe.contentWindow.changeGroup = function () {};

            const { contentWindow } = document.getElementById("targetFrame")! as HTMLIFrameElement;
            const { document: doc } = contentWindow!;

            // leaflet-left
            for (let i = 0; i < ressources.length; i++) {
                if (ressources[i] === -1) continue;
                injectRessource(i, getRessourceById(ressources[i]));
            }
            doc.body.innerHTML =
                doc.body.innerHTML +
                `<style>
                    .player {
                        outline: 5px solid red;
                    }
                    #menu, .leaflet-control-container, #pickRessourceContainer, #groupTitle {
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
        drawRectangle({ contentWindow: contentWindow as IFrameWindow, position, center: true });
    }, [position]);

    return (
        <Flex h="100vh" pos="relative">
            <iframe id="targetFrame" width="100%" height="100%"></iframe>
            <OverlayGUI />
        </Flex>
    );
};

export const OverlayGUI = () => {
    return (
        <Flex pos="absolute" top="0" left="0" right="0" bottom="0" pointerEvents="none">
            <Stack
                zIndex="99999999"
                h="100%"
                w="50px"
                bgColor="gray"
                position="absolute"
                left="0"
                pointerEvents="initial"
                alignItems="center"
            >
                <Icon
                    as={RiCloseFill}
                    pointerEvents="initial"
                    cursor="pointer"
                    onClick={() => {
                        window.ipcRenderer.send("close");
                    }}
                    boxSize="25px"
                    mt="10px"
                />
                <RessourcePickers />
                <Box w="100%" h="100%" __css={{ WebkitAppRegion: "drag" }}></Box>
            </Stack>
        </Flex>
    );
};

const currentIndexAtom = atom(-1);

const bgColors = ["#FF221C", "#AD0400", "#680300"];
export const RessourcePickers = () => {
    const [ressources, setRessources] = useAtom(ressourcesAtom);

    const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);

    useEffect(() => {
        const mapped = ressources.map((res) =>
            ressourcesData.find((item) => item.id == String(res))
        );
    }, [ressources]);

    return (
        <>
            {makeArrayOf(3).map((_, index) => (
                <RessourcePicker key={index} index={index} onClick={() => setCurrentIndex(index)} />
            ))}
            <RessourceModal
                isOpen={currentIndex !== -1}
                index={currentIndex}
                onClose={() => setCurrentIndex(-1)}
            />
        </>
    );
};

const adaptBgPosition = (bgPosition: string, size: number) => {
    return bgPosition
        .split(" ")
        .map((str) => String((Number(str.replace("px", "")) / 52) * size) + "px")
        .join(" ");
};

export const RessourcePicker = ({ index, onClick }: { index: number } & BoxProps) => {
    const [ressources, setRessources] = useAtom(ressourcesAtom);
    const me = ressources[index];

    const ressourceObj = getRessourceById(me);

    const replaceRessource = () => {
        setRessources((ressources) => replaceInArray(ressources, index, -1));
        injectRessource(index);
    };

    return (
        <Center
            boxSize="40px"
            minHeight="40px"
            color="rgba(255, 255, 255, 0.5)"
            fontSize="30px"
            bg={bgColors[index]}
            cursor="pointer"
            onClick={(e) => (ressourceObj ? replaceRessource() : onClick?.(e))}
        >
            {ressourceObj ? (
                <RessourceIcon ressource={ressourceObj} hoverable />
            ) : (
                <Box pb="4px">?</Box>
            )}
        </Center>
    );
};
const uppercaseFirstLetter = (str: string) => str.slice(0, 1).toUpperCase() + str.slice(1);

export const RessourceModal = ({
    onClose,
    isOpen,
    index,
}: {
    onClose: () => void;
    isOpen: boolean;
    index: number;
}) => {
    const [ressources, setRessources] = useAtom(ressourcesAtom);

    return (
        <DarkMode>
            <Modal onClose={onClose} isOpen={isOpen}>
                <ModalCloseButton />
                <ModalContent>
                    <Stack justifyContent="center">
                        {metiers.map((metier) => (
                            <Box key={metier}>
                                <Box
                                    fontWeight="bold"
                                    p="10px"
                                    pl="20px"
                                    fontSize="20px"
                                    color="white"
                                >
                                    {uppercaseFirstLetter(metier)}
                                </Box>
                                <Center flexWrap="wrap">
                                    {ressourcesData
                                        .filter((res) => res.metier === metier)
                                        .map((res, i) => (
                                            <RessourceIcon
                                                key={i}
                                                ressource={res}
                                                size={52}
                                                onClick={() => {
                                                    setRessources((ressources) =>
                                                        replaceInArray(ressources, index, res.id)
                                                    );
                                                    injectRessource(index, res);
                                                    onClose();
                                                }}
                                            />
                                        ))}
                                </Center>
                            </Box>
                        ))}
                    </Stack>
                </ModalContent>
            </Modal>
        </DarkMode>
    );
};

export const RessourceIcon = ({
    ressource,
    hoverable,
    size = 40,
    ...props
}: {
    ressource: typeof ressourcesData[0];
    hoverable?: boolean;
    size?: number;
} & BoxProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Box
            boxSize={size + "px"}
            bg={`url(${spriteMap})`}
            bgPos={adaptBgPosition(ressource.backgroundPosition, size)}
            bgSize={`${16 * size}px ${5 * size}px`}
            pos="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {hoverable && (
                <Center boxSize="100%" opacity={isHovered ? 1 : 0} transition="opacity .3s">
                    <Icon
                        as={RiCloseFill}
                        pointerEvents="initial"
                        color="white"
                        cursor="pointer"
                        boxSize="100%"
                    />
                </Center>
            )}
        </Box>
    );
};

export const SettingsModal = () => {
    const ref = useRef(null);

    useEffect(() => {
        const { contentWindow } = document.getElementById("targetFrame")! as HTMLIFrameElement;
        const { document: doc } = contentWindow!;

        const picker = doc.getElementById("ressourcesPicker")!;
    }, []);

    return <Box ref={ref}></Box>;
};
