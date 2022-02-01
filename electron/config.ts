import fs from "fs/promises";
import path from "path";

export const config: { current: Record<string, any> | null } = { current: null };

const initialConfig = {
    windowsNotifications: true,
    dirname: __dirname,
    defaultLossMessage:
        "\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}\u{1F602}",
};
const configFilePath = path.join(__dirname, "config.json");
export const loadConfig = async () => {
    try {
        const configArr = JSON.parse(await fs.readFile(configFilePath, "utf-8"));
        config.current = configArr;
    } catch (e) {
        console.log("no config file found, creating it...");
        config.current = { ...initialConfig };
        await persistConfig();
    } finally {
        return config.current;
    }
};

export const editConfig = async (callback: () => void) => {
    callback();
    persistConfig();
};

export const persistConfig = () =>
    config.current &&
    //@ts-ignore
    (console.log(config.current) ||
        fs.writeFile(configFilePath, JSON.stringify(config.current, null, 4)));
