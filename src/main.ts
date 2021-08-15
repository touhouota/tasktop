import { BrowserWindow, app, App, ipcMain } from "electron";
import path from "path";
import { IpcMainEvent } from "electron/main";
import SpreadsheetService from "./main/SpreadsheetService";
import OAuthClient from "./main/OAuthClient";
import { GoogleApis } from "googleapis";

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
                    standard: "Noto Sans CJK JP",
                },
                nodeIntegration: false,
                contextIsolation: true,
                sandbox: true,
                preload: path.resolve(getResourceDirectory(), "preload.js"),
            },
        });

        this.mainWindow.loadFile(
            path.resolve(getResourceDirectory(), "scripts/index.html")
        );

        // DevToolを開く
        this.mainWindow.webContents.openDevTools();

        this.mainWindow.on("closed", () => {
            this.mainWindow = null;
        });
    }

    private onReady() {
        this.create();

        ipcMain.on("auth-start", async (event) => {
            const client = new OAuthClient();
            const url = client.generateAuthUrl({
                scope: [
                    // 参考： https://developers.google.com/sheets/api/guides/authorizing
                    "https://www.googleapis.com/auth/spreadsheets",
                    // https://developers.google.com/drive/api/v3/about-auth?hl=en
                    "https://www.googleapis.com/auth/drive",
                ],
            });

            await client.authorize(url, event);
            const sheetService = new SpreadsheetService(client);
            sheetService.initialize();
        });
    }

    private onActivated() {
        if (this.mainWindow === null) {
            this.create();
        }
    }
}

const getResourceDirectory = () =>
    process.env.NODE_ENV === "development"
        ? path.join(process.cwd(), "dist")
        : path.join(process.cwd(), "dist");
// : path.join(process.resourcesPath, "app.asar.unpacked", "dist")
const MyApp: SampleApp = new SampleApp(app);
