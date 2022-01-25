import { Box, Center, Spinner } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { Routes, Route, useLocation } from "react-router-dom";
import { lcuStatusAtom } from "./components/LCUConnector";
import { Navbar, navbarHeight } from "./components/Navbar";
import { FriendDetails } from "./features/FriendDetails/FriendDetails";
import { FriendList } from "./features/FriendList/FriendList";
import { Notifications } from "./features/Notifications/Notifications";
import { OptionsPage } from "./features/Options/OptionsPage";

export const MainContainer = () => {
    const lcuStatus = useAtomValue(lcuStatusAtom);
    const location = useLocation();

    if (!lcuStatus)
        return (
            <Center w="100vw" h="100vh" flexDir="column">
                <Spinner />
                <Box mt="50px">Waiting for LoL client to be detected</Box>
            </Center>
        );

    return (
        <Box w="100vw" h="100vh" pos="relative">
            <Navbar pos="fixed" top="0" left="0" right="0" />
            <Box h={`calc(100% - ${navbarHeight}px)`}>
                <Box pt={`${navbarHeight}px`} />
                <AppRoutes />
            </Box>
        </Box>
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Notifications />} />
            <Route path="/friendlist" element={<FriendList />} />
            <Route path="/friend/:puuid" element={<FriendDetails />} />
            <Route path="/options" element={<OptionsPage />} />
        </Routes>
    );
};
