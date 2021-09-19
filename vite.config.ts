import reactRefresh from "@vitejs/plugin-react-refresh";
import { UserConfig, ConfigEnv, defineConfig } from "vite";
import { join } from "path";

const srcRoot = join(__dirname, "src");

export default defineConfig({
    base: "/",
    root: "./",
    build: {
        outDir: "./dist",
        emptyOutDir: true,
    },
    plugins: [reactRefresh()],
    resolve: {
        alias: [
            {
                find: "@",
                replacement: "/src",
            },
        ],
    },
});
// export default ({ command }: ConfigEnv): UserConfig => {
//     // DEV
//     if (command === "serve") {
//         return {
//             base: "/",
//             publicDir: `${__dirname}/public`,
//             plugins: [reactRefresh()],
//             alias: {
//                 "/@": srcRoot,
//             },
//             build: {
//                 outDir: join(srcRoot, "/out"),
//                 emptyOutDir: true,
//                 rollupOptions: {},
//             },
//             server: {
//                 port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
//             },
//             optimizeDeps: {
//                 auto: true,
//                 exclude: ["path"],
//             },
//         };
//     }
//     // PROD
//     else {
//         return {
//             base: `${__dirname}/src/out/`,
//             publicDir: `${__dirname}/public`,
//             plugins: [reactRefresh()],
//             alias: {
//                 "/@": srcRoot,
//             },
//             build: {
//                 outDir: join(srcRoot, "/out"),
//                 emptyOutDir: true,
//                 rollupOptions: {},
//             },
//             server: {
//                 port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
//             },
//             root: "./",
//             optimizeDeps: {
//                 auto: true,
//                 exclude: ["path"],
//             },
//         };
//     }
// };
