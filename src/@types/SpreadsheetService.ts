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