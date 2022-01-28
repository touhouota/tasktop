import { google } from "googleapis";

type FileResponse = {
    kind: string;
    id: string;
    name: string;
    mineType: string;
};

type DriveResponse = {
    data: {
        files: Array<FileResponse>;
    };
};

type SheetsResponse = {
    spreadsheetId: string;
};

type SpreadsheetResponse = {
    data: SheetsResponse;
};

// minetype
// https://developers.google.com/drive/api/v3/mime-types?hl=en
const MASTER_DATA = {
    FOLDER_STRUCTURE: {
        name: "Tasktop Masters",
        mimeType: "application/vnd.google-apps.folder",
    },

    SHEET_STRUCTURE: {
        // 「taskop」というスプシに「taskList」という名前のワークシートを持つ
        properties: {
            title: "tasktop",
        },
        sheets: [
            {
                properties: {
                    title: "taskList",
                },
            },
        ],
    },
};

export default class SpreadsheetService {
    auth: google.auth.OAuth2;
    driveClient: GoogleApis["drive_v3"];
    sheetClient: GoogleApis["sheet_v4"];
    sheetId: string | null;

    constructor(auth: GoogleApis["auth"]["OAuth2"]) {
        google.options({ auth: auth });
        this.driveClient = google.drive({ version: "v3", auth: auth });
        this.sheetClient = google.sheets({ version: "v4", auth: auth });
        this.sheetId = null;
    }

    async initialize(): Promise<void> {
        let masterFolderId: string | null = await this.getMasterFolder();
        if (!masterFolderId) {
            masterFolderId = await this.createMasterFolder();
            if (!masterFolderId) process.exit(1);
        }

        this.sheetId = await this.getTaskSheetId(masterFolderId);
        if (!this.sheetId) {
            const sheetId = await this.createTaskListSheet();
            if (!sheetId) process.exit(1);

            await this.moveToTaskListSheet(sheetId, masterFolderId);
            this.sheetId = sheetId;
        }

        console.log("tasktop initialized!");
    }

    async getMasterFolder(): Promise<string | null> {
        // TODO: 対象ファイル・フォルダがあるか確認したい
        const masterFolderQuery = {
            q: `mimeType = '${MASTER_DATA.FOLDER_STRUCTURE.mimeType}' and name = '${MASTER_DATA.FOLDER_STRUCTURE.name}' and trashed = false`,
        };

        return await this.driveClient.files
            .list(masterFolderQuery)
            .then(
                (response: DriveResponse): DriveResponse["data"] =>
                    response.data
            )
            .then(
                (data: DriveResponse["data"]): Array<FileResponse> | false =>
                    data.files
            )
            .then((files: Array<FileResponse>): string | null => {
                // 結果が1であればすでにある
                if (files.length === 1) {
                    return files[0].id;
                }
                // TODO: 複数ある場合の対応
                return null;
            })
            .catch((error: Error): null => {
                console.log("Folder search error: ", error);
                return null;
            });
    }

    async getTaskSheetId(masterFolderId: string): Promise<string | null> {
        const taskSheetQuery = {
            q: `mimeType = 'application/vnd.google-apps.spreadsheet' and name = '${MASTER_DATA.SHEET_STRUCTURE.properties.title}' and '${masterFolderId}' in parents and trashed = false`,
        };

        return await this.driveClient.files
            .list(taskSheetQuery)
            .then((response: DriveResponse) => response.data)
            .then((data: DriveResponse["data"]) => data.files)
            .then((files: Array<FileResponse>): string | null => {
                if (files.length === 1) {
                    return files[0].id;
                }
                // TODO: 複数ある場合の対応
                return null;
            })
            .catch((error: Error) => {
                console.log("error:", error);
                return null;
            });
    }

    private async createMasterFolder(): Promise<string | null> {
        return await this.driveClient.files
            .create({
                resource: MASTER_DATA.FOLDER_STRUCTURE,
                fileds: "id",
            })
            .then(
                (response: DriveResponse): DriveResponse["data"] =>
                    response.data
            )
            .then((data: FileResponse): string | null => {
                if (data.id) {
                    return data.id;
                }
                return null;
            })
            .catch((err: Error) => {
                console.log("[createMasterFolder]: ", err);
                return null;
            });
    }

    private async createTaskListSheet(): Promise<string | null> {
        // NOTE: spreadsheets.createはドライブ直下に作成する
        return this.sheetClient.spreadsheets
            .create({
                resource: MASTER_DATA.SHEET_STRUCTURE,
                fields: "spreadsheetId",
            })
            .then(
                (response: SpreadsheetResponse): SheetsResponse => response.data
            )
            .then((data: SheetsResponse): string | null => {
                if (data.spreadsheetId) {
                    return data.spreadsheetId;
                }
                return null;
            })
            .catch((err: Error) => {
                console.log("[createTaskListSheet]: ", err);
                return null;
            });
    }

    private async moveToTaskListSheet(
        sheetId: string,
        moveFolderId: string
    ): Promise<true | false> {
        const params = {
            fileId: sheetId,
            addParents: [moveFolderId].join(","),
        };

        return this.driveClient.files
            .update(params)
            .then(
                (response: DriveResponse): DriveResponse["data"] =>
                    response.data
            )
            .then((data: FileResponse): true | false => {
                if (data.id === this.sheetId) return true;

                return false;
            })
            .catch((error: Error): false => {
                console.log("ERROR:", error);
                return false;
            });
    }
}
