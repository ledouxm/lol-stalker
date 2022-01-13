import reactRefresh from "@vitejs/plugin-react-refresh";
import { UserConfig, ConfigEnv, defineConfig } from "vite";
import { join } from "path";

const srcRoot = join(__dirname, "src");

// export default defineConfig({
//     base: "/",
//     root: "./",
//     alias: {
//                         "/@": srcRoot,
//                     },
//                     build: {
//                         outDir: join(srcRoot, "/out"),
//                         emptyOutDir: true,
//                         rollupOptions: {},
//                     },
//     plugins: [reactRefresh()],
//     resolve: {
//         alias: [
//             {
//                 find: "@",
//                 replacement: "/src",
//             },
//         ],
//     },
// });
export default ({ command }: ConfigEnv): UserConfig => {
    // DEV
    if (command === "serve") {
        return {
            base: "/",
            publicDir: `${__dirname}/public`,
            plugins: [reactRefresh()],
            alias: {
                "/@": srcRoot,
            },
            build: {
                outDir: join(srcRoot, "/out"),
                emptyOutDir: true,
                rollupOptions: {},
            },

            esbuild: {
                jsxInject: `import React from 'react'`,
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
            plugins: [reactRefresh()],
            alias: {
                "/@": srcRoot,
            },
            build: {
                outDir: join(srcRoot, "/out"),
                emptyOutDir: true,
                rollupOptions: {},
            },

            esbuild: {
                jsxInject: `import React from 'react'`,
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
