import { Box, Center, Spinner } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { Routes, Route } from "react-router-dom";
import { lcuStatusAtom } from "./components/LCUConnector";
import { FriendDetails } from "./features/FriendDetails/FriendDetails";
import { Home } from "./Home";

export const MainContainer = () => {
    const lcuStatus = useAtomValue(lcuStatusAtom);

    if (!lcuStatus)
        return (
            <Center w="100vw" h="100vh" flexDir="column">
                <Spinner />
                <Box mt="50px">Waiting for LoL client to be detected</Box>
            </Center>
        );

    return (
        <Box w="100vw" h="100vh">
            <AppRoutes />
        </Box>
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/friend/:puuid" element={<FriendDetails />} />
        </Routes>
    );
};
