import { Box, ChakraProvider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { FriendList } from "./components/FriendList";
import { LCUConnector } from "./components/LCUConnector";
import theme from "./theme";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <LCUConnector />
                <FriendList />
            </ChakraProvider>
        </QueryClientProvider>
    );
}

export default App;
