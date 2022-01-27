import { extendTheme } from "@chakra-ui/react";

export const scrollbarStyle = {
    css: {
        "&::-webkit-scrollbar": {
            width: "7px",
            height: "7px",
        },
        "&::-webkit-scrollbar-track": {
            borderRadius: "7px",
        },
        "&::-webkit-scrollbar-thumb": {
            borderRadius: "7px",
            backgroundColor: "#C1C1C1",
        },
    },
};

const config = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

const theme = extendTheme({ config, colors: { "red-loss": "#ff2344", "blue-win": "#0acce6" } });

export default theme;
