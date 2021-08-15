import { contextBridge, ipcRenderer } from "electron";

console.log("preload");

contextBridge.exposeInMainWorld("myAPI", {
    electron: true,
    setOAuthButtonEvent: () => {
        const button = document.getElementById("login_button");
        button?.addEventListener("click", () => {
            console.log("button click");
            ipcRenderer.send("auth-start");
        });

        ipcRenderer.on("auth-success", async (event, tokens) => {
            // login buttonを隠す
            const button = document.getElementById("login_button");
            if (button) {
                button.style.display = "none";
            }

            console.log("auth success.");
            console.log("token: ", tokens);
        });
    },
});
