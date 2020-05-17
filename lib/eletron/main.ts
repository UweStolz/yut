import { app, BrowserWindow } from 'electron';

let win: BrowserWindow | null = null;

function createWindow(): void {
  win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.loadURL(`file://${__dirname}/renderer/index.html`);
}

export function getWindow(): BrowserWindow|null {
  return win;
}

export function exitApp(): void {
  try {
    if (win) {
      win.close();
      win = null;
    }
    app.quit();
  } catch {
    app.exit();
  }
}

app.on('ready', createWindow);
app.allowRendererProcessReuse = true;
app.commandLine.appendSwitch('—-ignore-gpu-blacklist');
