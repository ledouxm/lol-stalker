import { Box, BoxProps } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { socketStatusAtom } from "./LCUConnector";

export const SocketStatus = (props: BoxProps) => {
    const socketStatus = useAtomValue(socketStatusAtom);
    console.log(socketStatus);
    return <Box {...props}>{socketStatus}</Box>;
};
