import AutoLaunch from "auto-launch";
import electronIsDev from "electron-is-dev";
import { editStoreEntry, store } from "./store";

export const initAutoLauch = async () => {
    const autoLaunch = new AutoLaunch({ name: "LoL Stalker" });
    await editStoreEntry("autoLaunch", autoLaunch);

    if (electronIsDev) return console.log("AutoLaunch doesn't work in development");
    const isEnabled = await autoLaunch.isEnabled();

    if (store.config.autoLaunch && !isEnabled) autoLaunch.enable();
    else if (isEnabled) autoLaunch.disable();
};

export const enableAutoLaunch = async () => {
    console.log("enabling autolaunch...");
    if (electronIsDev) return console.log("AutoLaunch doesn't work in development");
    const autoLaunch = store.autoLaunch;
    if (!autoLaunch) return;

    const isEnabled = await autoLaunch.isEnabled();

    if (isEnabled) return;
    autoLaunch.enable();
    console.log("autolaunch enabled");
};

export const disableAutoLauch = async () => {
    console.log("disabling autolaunch...");
    const autoLaunch = store.autoLaunch;
    if (!autoLaunch) return;

    const isEnabled = await autoLaunch.isEnabled();

    if (!isEnabled) return;
    autoLaunch.disable();
    console.log("autolaunch disabled");
};
