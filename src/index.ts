import {
  BrowserWindow, app, App,
} from 'electron';

class Tasktop {
    private mainWindow: BrowserWindow | null = null;

    private application: App;

    private mainURL = `file://${__dirname}/index.html`

    constructor(application: App) {
      this.application = application;
      this.application.on('window-all-closed', this.onWindowAllClosed.bind(this));
      this.application.on('ready', this.create.bind(this));
      this.application.on('activate', this.onActivated.bind(this));
    }

    private onWindowAllClosed() {
      this.application.quit();
    }

    private create() {
      this.mainWindow = new BrowserWindow({
        width: 450,
        height: 450,
        acceptFirstMouse: true,
        titleBarStyle: 'hidden',
      });

      this.mainWindow.setAlwaysOnTop(true);

      this.mainWindow.loadURL(this.mainURL)
        .catch((err) => console.log(err));

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

const tasktop: Tasktop = new Tasktop(app);
