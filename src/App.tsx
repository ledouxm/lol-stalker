import { Box, ChakraProvider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AppCanvas, Socket } from "./components/Socket";

function App() {
    return (
        <ChakraProvider>
            <Socket />
            <AppCanvas />
        </ChakraProvider>
    );
}

export default App;
