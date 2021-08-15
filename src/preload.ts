import { contextBridge, ipcRenderer } from "electron";
import { IpcRendererEvent } from "electron/main";

console.log("preload");

contextBridge.exposeInMainWorld("myAPI", {
    setOAuthButtonEvent: () => {
        ipcRenderer.send("auth-start");

        ipcRenderer.on("auth-success", async (event, tokens) => {
            console.log("auth success.");
        });
    },
});
