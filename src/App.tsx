import { Box, ChakraProvider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AppCanvas, Socket } from "./components/Socket";

function App() {
    console.log(window.ipcRenderer);

    const [isOpen, setOpen] = useState(false);
    const [isSent, setSent] = useState(false);

    const [fromMain, setFromMain] = useState<string | null>(null);

    const handleToggle = () => {
        if (isOpen) {
            setOpen(false);
            setSent(false);
        } else {
            setOpen(true);
            setFromMain(null);
        }
    };
    const sendMessageToElectron = () => {
        window.Main.sendMessage("Hello I'm from React World");
        setSent(true);
    };

    useEffect(() => {
        if (isSent)
            window.Main.on("message", (fromMain: string) => {
                setFromMain(fromMain);
            });
    }, [fromMain, isSent]);

    return (
        <ChakraProvider>
            <Socket />
            <AppCanvas />
        </ChakraProvider>
    );
}

export default App;
