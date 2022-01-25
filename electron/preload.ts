import { ipcRenderer, contextBridge } from "electron";
// import { prisma } from "./db";
// import { friendsApi } from "./routes/friends";
// import { notificationsApi } from "./routes/notifications";
declare global {
    interface Window {
        Main: typeof api;
        ipcRenderer: typeof ipcRenderer;
        // friendsApi: typeof friendsApi;
        // notificationsApi: typeof notificationsApi;
        // prisma: typeof prisma;
    }
}

export const api = {
    /**
     * Here you can expose functions to the renderer process
     * so they can interact with the main (electron) side
     * without security problems.
     *
     * The function below can accessed using `window.Main.sayHello`
     */
    sendMessage: (channel: string, message?: string) => {
        ipcRenderer.send(channel, message);
    },
    /**
     * Provide an easier way to listen to events
     */
    on: (channel: string, callback: Function) => {
        ipcRenderer.on(channel, (_, data) => callback(data));
    },
    off: (channel: string) => ipcRenderer.removeAllListeners(channel),
    getEventNames: () => ipcRenderer.eventNames(),
};
contextBridge.exposeInMainWorld("Main", api);
// contextBridge.exposeInMainWorld("friendsApi", friendsApi);
// contextBridge.exposeInMainWorld("notificationsApi", notificationsApi);
/**
 * Using the ipcRenderer directly in the browser through the contextBridge ist not really secure.
 * I advise using the Main/api way !!
 */
contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
// contextBridge.exposeInMainWorld("prisma", prisma);
