import { app, BrowserWindow, screen, Display, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { createAotCompiler } from '@angular/compiler';

let windows: BrowserWindow[] = [];
let puckWindow: BrowserWindow;
let mapWindow: BrowserWindow;
let secondWindow: BrowserWindow;
let win: BrowserWindow = null;
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

function createWindows() {
  windows = [];
  mapWindow = null;
  secondWindow = null;
  puckWindow = null;

  screen.getAllDisplays().forEach(el => {
    const window = setupWindow(el);
    windows.push(window);
  })

  ipcMain.on('set-map-window', (evt, msg) => {
    windows.forEach(el => {
      if (el.webContents === evt.sender) {
        mapWindow = el;
        mapWindow.webContents.send('map-window-confirmation', 'Map Window & Puck Window successfully set.');
        if (!puckWindow) {
          setupPuckWindow();
        }
      }
    })
    if (secondWindow && mapWindow && puckWindow) {
      closeExtraWindows();
    }
  });

  ipcMain.on('set-secondscreen-window', (evt, msg) => {
    windows.forEach(el => {
      if (el.webContents === evt.sender) {
        secondWindow = el;
        secondWindow.webContents.send('secondscreen-window-confirmation', 'SecondScreen Window successfully set.');
      }
    })
    if (secondWindow && mapWindow && puckWindow) {
      closeExtraWindows();
    }
  });

  ipcMain.on('clear-window-selections', (evt, msg) => {
    if (mapWindow) {
      mapWindow.webContents.send('message-for-map-window', { reset: true });
      mapWindow.close();
    }
    if (secondWindow) {
      secondWindow.webContents.send('message-for-secondscreen-window', { reset: true });
      secondWindow.close();
    }
    if (puckWindow) {
      puckWindow.webContents.send('message-for-puck-window', { reset: true });
      puckWindow.close();
    }
    closeExtraWindows();
    mapWindow = null;
    puckWindow = null;
    secondWindow = null;
    createWindows();
  });

  ipcMain.on('is-window-set', (evt, msg) => {
    if (mapWindow && mapWindow.webContents === evt.sender) {
      mapWindow.webContents.send('window-is-set', { windowName: "map" });
    } else if (secondWindow && secondWindow.webContents === evt.sender) {
      secondWindow.webContents.send('window-is-set', { windowName: "secondscreen" });
    } else if (puckWindow && puckWindow.webContents === evt.sender) {
      puckWindow.webContents.send('window-is-set', { windowName: "puck" });
    }
  });
  ipcMain.on('close', () => closeProgram());
}

function setupPuckWindow() {
  const x = mapWindow.getPosition()[0];
  const y = mapWindow.getPosition()[1];
  const w = mapWindow.getSize()[0];
  const h = mapWindow.getSize()[1];
  mapWindow.setFullScreen(false);
  mapWindow.setSize(w - 600, h);
  mapWindow.setPosition(x + 600, y);
  puckWindow = new BrowserWindow({
    x: x,
    y: y,
    width: 600,
    height: h,
    fullscreen: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
      hardResetMethod: 'exit'
    });
    puckWindow.loadURL('http://localhost:4200');
    // window.webContents.openDevTools();
  } else {
    puckWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }
}

function closeExtraWindows() {
  windows.forEach(el => {
    if (el !== mapWindow && el !== secondWindow && el !== puckWindow) {
      el.close();
    }
  });
}

function setupWindow(display: Display): BrowserWindow {
  const window = new BrowserWindow({
    x: 0 + display.bounds.x,
    y: 0 + display.bounds.y,
    width: display.workAreaSize.width * display.scaleFactor,
    height: display.workAreaSize.height * display.scaleFactor,
    fullscreen: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
      hardResetMethod: 'exit'
    });
    window.loadURL('http://localhost:4200');
    // window.webContents.openDevTools();
  } else {
    window.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }
  return window;
}

function closeProgram() {
  if (mapWindow) {
    mapWindow.close();
  }
  if (secondWindow) {
    secondWindow.close();
  }
  if (puckWindow) {
    puckWindow.close();
  }
  app.quit();
}



try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindows);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindows();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
