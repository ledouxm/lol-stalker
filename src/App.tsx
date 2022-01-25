import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { LCUConnector } from "./components/LCUConnector";
import { FriendDetails } from "./features/FriendDetails/FriendDetails";
import { Home } from "./Home";
import { MainContainer } from "./MainContainer";
import theme from "./theme";

const queryClient = new QueryClient();

function App() {
    return (
        <HashRouter>
            <QueryClientProvider client={queryClient}>
                <ChakraProvider theme={theme}>
                    <LCUConnector />
                    <MainContainer />
                </ChakraProvider>
            </QueryClientProvider>
        </HashRouter>
    );
}

export default App;
