import { Box, ChakraProvider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { LCUConnector } from "./components/LCUConnector";

function App() {
    return (
        <ChakraProvider>
            <LCUConnector />
        </ChakraProvider>
    );
}

export default App;
