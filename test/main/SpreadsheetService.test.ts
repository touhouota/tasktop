import fs from "fs";
import path from "path";
import SpreadsheetService from "../../src/main/SpreadsheetService";

describe("タスク作成", () => {
    let service: SpreadsheetService;

    beforeAll(() => {
        const credentialPath = path.resolve("./src/main/google/client_secret.json");
        console.log(credentialPath);

        const credentialContent = <string><unknown>fs.readFileSync(credentialPath);
        const credentials = JSON.parse(credentialContent);

        service = new SpreadsheetService(credentials);
    })

    test("タスク作る", async () => {
        let task = {
            name: "task",
            status: 0
        }

        let {result, task: addedTask} = await service.createTask(task);
        expect(result).toBeTruthy();
        expect(addedTask).toStrictEqual(task);
    });
});