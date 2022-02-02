import path from "path";
import fs from "fs";
import { app } from "electron";
import { BrowserWindow, IpcMain, IpcMainEvent } from "electron";
import { google, GoogleApis } from "googleapis";
import {
    client_id,
    client_secret,
    redirect_uris,
} from "./google/client_secret.json";

type AuthResult = {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expiry_date: number;
};

export default class OAuthClient extends google.auth.OAuth2 {
    tokenBasePath: string;

    constructor(
        clientId: string = client_id,
        clientSecret: string = client_secret,
        redirectUri: string = redirect_uris[0],
    ) {
        super(clientId, clientSecret, redirectUri);
        this.tokenBasePath = path.resolve(app.getAppPath(), "credentials");
        this.createCredentialsFolderUnlessExist();
        console.log(this.tokenBasePath);
    }

    async authorize(authPageURL: string, event: IpcMainEvent): Promise<void> {
        const tokenPath = path.join(this.tokenBasePath, "access_token.json");
        const token: AuthResult = await fs.promises
            .readFile(tokenPath, "utf-8")
            .then(async (content: string): Promise<AuthResult> => {
                // ファイルを読んで、Token取得する
                console.log("ファイル読んだよ");

                const tokens = JSON.parse(content);

                this.setCredentials({
                    refresh_token: tokens.refresh_token,
                });

                const token = this.credentials;
                if (!token) throw Error("AccessTokenがないよ");

                event.reply("auth-success", token);

                return <AuthResult>token;
            })
            .catch(async (error): Promise<AuthResult> => {
                // ファイル読めない or トークン取得できない場合は新規で取得する
                console.log("ファイルないので認証するよ", error);

                const url = this.generateAuthUrl({
                    scope: [
                        // 参考： https://developers.google.com/sheets/api/guides/authorizing
                        "https://www.googleapis.com/auth/spreadsheets",
                        // https://developers.google.com/drive/api/v3/about-auth?hl=en
                        "https://www.googleapis.com/auth/drive",
                    ],
                });

                const authWindow = new BrowserWindow({
                    useContentSize: true,
                });

                // 認証用のページを開く
                const code = await getOAuthCodeByInteraction(authWindow, url);

                if (!code) {
                    throw new Error("get code fail.");
                }

                const response = await this.getToken(code);
                const tokens = response.tokens;

                event.reply("auth-success", tokens);
                this.setCredentials(tokens);

                return <AuthResult>tokens;
            });

        const accessTokenJson = JSON.stringify(token);
        console.log("AccessToken: ", token);
        fs.promises.writeFile(tokenPath, accessTokenJson).catch((error) => {
            console.log("ファイル書き込みに失敗：", error);
        });
    }

    private createCredentialsFolderUnlessExist(): void {
        if (!fs.existsSync(this.tokenBasePath)) {
            fs.mkdirSync(this.tokenBasePath);
        }
    }
}

const getOAuthCodeByInteraction = async (
    interactionWindow: BrowserWindow,
    authPageURL: string,
): Promise<string | null> => {
    interactionWindow.loadURL(authPageURL);

    return new Promise((resolve, reject) => {
        const onClosed = () => {
            reject("Interaction ended intentionally...");
        };
        interactionWindow.on("closed", onClosed);
        interactionWindow.on("page-title-updated", (event: IpcMainEvent) => {
            const url = new URL(event.sender.getURL());
            if (url.searchParams.get("approvalCode")) {
                interactionWindow.removeListener("closed", onClosed);
                interactionWindow.close();
                return resolve(url.searchParams.get("approvalCode"));
            }

            const oAuthStatus = url.searchParams.get("response") || "";
            if (oAuthStatus.startsWith("error=")) {
                interactionWindow.removeListener("closed", onClosed);
                interactionWindow.close();
                return reject(url.searchParams.get("response"));
            }
        });
    });
};
