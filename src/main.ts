import { BrowserWindow, app, App, ipcMain } from "electron";
import path from "path";
import { google } from "googleapis";
import { client_id, client_secret, redirect_uris } from "./main/google/client_secret.json";
import { IpcRendererEvent } from "electron/main";
import SpreadsheetService from "./main/google/SpreadsheetService";

class SampleApp {
    private mainWindow: BrowserWindow | null = null;
    private app: App;

    constructor(application: App) {
        this.app = application;

        this.onWindowAllClosed = this.onWindowAllClosed.bind(this);
        this.onReady = this.onReady.bind(this);
        this.onActivated = this.onActivated.bind(this);

        this.app.on("window-all-closed", this.onWindowAllClosed);
        this.app.on("ready", this.onReady);
        this.app.on("activate", this.onActivated);
    }

    private onWindowAllClosed() {
        this.app.quit();
    }

    private create() {
        this.mainWindow = new BrowserWindow({
            width: 1000,
            height: 500,
            minWidth: 500,
            minHeight: 200,
            acceptFirstMouse: true,
            titleBarStyle: "hidden",
            webPreferences: {
                defaultFontFamily: {
                    standard: "Noto Sans CJK JP"
                },
                nodeIntegration: false,
                contextIsolation: true,
                sandbox: true,
                preload: path.resolve(getResourceDirectory(), "preload.js"),
            }
        });
        console.log(path.resolve(getResourceDirectory(), "preload.js"));

        this.mainWindow.loadFile(path.resolve(getResourceDirectory(), "scripts/index.html"))

        // DevToolを開く
        this.mainWindow.webContents.openDevTools();

        this.mainWindow.on("closed", () => {
            this.mainWindow = null;
        });
    }

    private onReady() {
        this.create();

        ipcMain.on("auth-start", async (event) => {
            const client = initOAuthClient();
            const url = client.generateAuthUrl({
                scope: [
                    // 参考： https://developers.google.com/sheets/api/guides/authorizing
                    "https://www.googleapis.com/auth/spreadsheets",
                    // https://developers.google.com/drive/api/v3/about-auth?hl=en
                    "https://www.googleapis.com/auth/drive"
                ]
            });

            const authWindow = new BrowserWindow({ x: 60, y: 60, useContentSize: true });
            const code = await getOAuthCodeByInteraction(authWindow, url);

            if(!code) {
                throw new Error("get code fail.");
            }

            let response = await client.getToken(code);
            event.reply("auth-success", response.tokens);

            client.setCredentials(response.tokens);
            const sheetService = new SpreadsheetService(client);
            sheetService.initialize();
        })
    }

    private onActivated() {
        if (this.mainWindow === null) {
            this.create();
        }
    }
};

const initOAuthClient = () => {
    return new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]
    )
};

const getOAuthCodeByInteraction = (interactionWindow: any, authPageURL: string): Promise<string|null> => {
    interactionWindow.loadURL(authPageURL);

    return new Promise((resolve, reject) => {
        const onClosed = () => {
            reject("Interaction ended intentionally...");
        }

        interactionWindow.on("closed", onClosed);
        interactionWindow.on("page-title-updated", (event: { sender: { getURL: () => string; }; }) => {
            const url = new URL(event.sender.getURL());
            if(url.searchParams.get("approvalCode")) {
                interactionWindow.removeListener("closed", onClosed);
                interactionWindow.close();
                return resolve(url.searchParams.get("approvalCode"));
            }
            if((url.searchParams.get("response") || "").startsWith("error=")) {
                interactionWindow.removeListener("closed", onClosed);
                interactionWindow.close();
                return reject(url.searchParams.get("response"));
            }
        })
    })
};

const getResourceDirectory = () => {
    return process.env.NODE_ENV === "development"
        ? path.join(process.cwd(), "dist")
        : path.join(process.cwd(), "dist")
        // : path.join(process.resourcesPath, "app.asar.unpacked", "dist")
}


const MyApp: SampleApp = new SampleApp(app);
