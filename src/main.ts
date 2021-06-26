import { BrowserWindow, app, App } from 'electron';

class SampleApp {
    private mainWindow: BrowserWindow | null = null;

    private app: App;

    private mainURL = `file://${__dirname}/scripts/index.html`;

    constructor(application: App) {
        this.app = application;
        this.app.on('window-all-closed', this.onWindowAllClosed.bind(this));
        this.app.on('ready', this.create.bind(this));
        this.app.on('activate', this.onActivated.bind(this));
    }

    private onWindowAllClosed() {
        this.app.quit();
    }

    private create() {
        this.mainWindow = new BrowserWindow({
            width: 800,
            height: 400,
            minWidth: 500,
            minHeight: 200,
            acceptFirstMouse: true,
            titleBarStyle: 'hidden',
        });

        this.mainWindow.loadURL(this.mainURL);

        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }

    private onReady() {
        this.create();
    }

    private onActivated() {
        if (this.mainWindow === null) {
            this.create();
        }
    }
}

const MyApp: SampleApp = new SampleApp(app);
