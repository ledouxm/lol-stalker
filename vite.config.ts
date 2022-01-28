import { UserConfig, ConfigEnv, defineConfig } from "vite";
import { join } from "path";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";
import react from "@vitejs/plugin-react";

const srcRoot = join(__dirname, "src");

export default ({ command }: ConfigEnv): UserConfig => {
    // DEV
    if (command === "serve") {
        return {
            base: "/",
            publicDir: `${__dirname}/public`,
            plugins: [react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } })],
            alias: {
                "/@": srcRoot,
            },
            build: {
                outDir: join(srcRoot, "/out"),
                emptyOutDir: true,
                rollupOptions: {},
            },
            server: {
                port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
            },
            optimizeDeps: {
                exclude: ["path"],
            },
        };
    }
    // PROD
    else {
        return {
            base: `${__dirname}/src/out/`,
            publicDir: `${__dirname}/public`,
            plugins: [],
            alias: {
                "/@": srcRoot,
            },
            build: {
                outDir: join(srcRoot, "/out"),
                emptyOutDir: true,
                rollupOptions: {},
            },
            server: {
                port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
            },
            root: "./",
            optimizeDeps: {
                exclude: ["path"],
            },
        };
    }
};
