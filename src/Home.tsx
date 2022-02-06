import { Box, Center, Flex, Icon, Spinner } from "@chakra-ui/react";
import { useAtomValue } from "jotai/utils";
import { Route, Routes, useLocation } from "react-router-dom";
import { Navbar, navbarHeight } from "./components/Navbar";
import { FriendDetails } from "./features/FriendDetails/FriendDetails";
import { FriendList } from "./features/FriendList/FriendList";
import { Notifications } from "./features/Notifications/Notifications";
import { OptionsPage } from "./features/Options/OptionsPage";
import { BiRefresh } from "react-icons/bi";
import { DevTools } from "./features/DevTools/DevTools";
import { Discord } from "./features/Discord/Discord";
import { lcuStatusAtom, Store } from "./components/LCUConnector";
import { SocketStatus } from "./components/SocketStatus";

export const Home = () => {
    const lcuStatus = useAtomValue(lcuStatusAtom);

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
                <Box mb={`${navbarHeight}px`} />
                <AppRoutes />
            </Box>
            <Flex
                position="absolute"
                right="10px"
                zIndex="11"
                top={`${-navbarHeight + 5}px`}
                alignItems="center"
            >
                <SocketStatus mr="10px" />
                <Box
                    boxSize="50px"
                    cursor="pointer"
                    transition="transform .3s"
                    transitionProperty="transform"
                    _hover={{ transform: "rotate(90deg)" }}
                    onClick={() => window.location.reload()}
                >
                    <Icon
                        boxSize="50px"
                        as={BiRefresh}
                        transition="color .3s"
                        _hover={{ color: "blue.400" }}
                    />
                </Box>
            </Flex>
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
            {process.env.NODE_ENV !== "PRODUCTION" && <Route path="/dev" element={<DevTools />} />}
            <Route path="/discord" element={<Discord />} />
        </Routes>
    );
};
