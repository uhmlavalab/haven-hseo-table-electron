import { app, BrowserWindow, screen, Display, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';

let windows: BrowserWindow[] = [];

let puckWindow: BrowserWindow;
let puckWindowMessenger: any;

let mapWindow: BrowserWindow;
let mapWindowMessenger: any;

let secondWindow: BrowserWindow;
let secondscreenWindowMessenger: any;

const args = process.argv.slice(1), serve = args.some(val => val === '--serve');

const dataDir = 'C:/ProgramData/ProjecTable';

let configFile = {
  puckWindowWidth: 200,
  plans: {
    oahu : {
      css: {
        mapwindow: {
          map: {
            position: { x: 0, y: 0 },
            size: {width: 0, height: 0},
          },
          linechart: {
            position: { x: 0, y: 0 },
            size: {width: 0, height: 0},
          },
          piechart: {
            position: { x: 0, y: 0 },
            size: {width: 0, height: 0},
          },
          textlabel: {
            position: {x: 0, y: 0},
            size: 18
          }
        },
        secondwindow: {
          map: {
            position: { x: 0, y: 0 },
            size: {width: 0, height: 0},
          },
          legend: {
            position: {x: 0, y: 0},
            size: {width: 200, height: 1000}
          },
          layerdetails: {
            position: {x:0, y: 0},
            size: {width: 400, height: 400}
          }
        }
      }
    }
  }
};

// Config File Functions
function loadConfigFile(): Promise<any> {
  return new Promise(resolve => {
    fs.readFile(`${dataDir}/tableConfig.json`, (err, data) => {
      if (err) throw err;
      configFile = JSON.parse(data.toString());
      return resolve(data);
    });
  })
}

function saveConfigFile(): Promise<any> {
  return new Promise(resolve => {
    fs.writeFile(`${dataDir}/tableConfig.json`, JSON.stringify(configFile), (err) => {
      if (err) throw err;
      return resolve(true);
    });
  });
}

function loadFile(window: Electron.BrowserWindow, fileName: string) {
  fs.readFile(`${dataDir}/${fileName}`, (err, data) => {
    if (err) throw err;
    if (window) {
      window.webContents.send('fileLoaded', data);
    }
    return data;
  });
}

function saveFile(window: Electron.BrowserWindow, fileName: string, file: any) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  fs.writeFile(`${dataDir}/${fileName}`, file, (err) => {
    if (err) throw err;
    if (window) {
      window.webContents.send('fileSaved', 'File Write Complete');
    }
  });
}

function createWindows() {
  windows = [];
  mapWindow = null;
  secondWindow = null;
  puckWindow = null;

  screen.getAllDisplays().forEach(el => {
    const window = setupWindow(el);
    windows.push(window);
  })

  ipcMain.on('set-map-window', (evt, msg) => setMapWindow(evt.sender));

  ipcMain.on('set-secondscreen-window', (evt, msg) => setSecondScreenWindow(evt.sender));

  ipcMain.on('clear-window-selections', (evt, msg) => cleanWindowSelections());

  ipcMain.on('is-window-set', (evt, msg) => isWindowSet(evt.sender));

  ipcMain.on('shift-puck-screen', (evt, msg) => shiftPuckScreen(msg.direction));

  ipcMain.on('save-config-element', (evt, msg) => saveConfigProperty(configFile, msg.path, msg.value));

  ipcMain.on('close', () => closeProgram());

}


function setMapWindow(winWebContents: Electron.WebContents) {
  windows.forEach(el => {
    if (el.webContents === winWebContents) {
      mapWindow = el;
      mapWindow.webContents.send('map-window-confirmation', 'Map Window successfully set.');
      mapWindow.webContents.send('send-config', {configFile: configFile});
      if (!mapWindowMessenger) {
        mapWindowMessenger = ipcMain.on('message-to-map-window', (evt, msg) => mapWindow.webContents.send('message-for-map-window', msg));
      }
      if (!puckWindow) {
        setupPuckWindow();
        puckWindow.webContents.send('puck-window-confirmation', 'Puck Window successfully set.');
        puckWindow.webContents.send('send-config', {configFile: configFile});

        if (!puckWindowMessenger) {
          puckWindowMessenger = ipcMain.on('message-to-puck-window', (evt, msg) => puckWindow.webContents.send('message-for-puck-window', msg));
        }
      }

    }
  })
  if (secondWindow && mapWindow && puckWindow) {
    closeExtraWindows();
  }
}

function setSecondScreenWindow(winWebContents: Electron.WebContents) {
  windows.forEach(el => {
    if (el.webContents === winWebContents) {
      secondWindow = el;
      secondWindow.webContents.send('secondscreen-window-confirmation', 'SecondScreen Window successfully set.');
      secondWindow.webContents.send('send-config', {configFile: configFile});
      if (!secondscreenWindowMessenger) {
        secondscreenWindowMessenger = ipcMain.on('message-to-secondscreen-window', (evt, msg) => secondWindow.webContents.send('message-for-secondscreen-window', msg));
      }
    }
  })
  if (secondWindow && mapWindow && puckWindow) {
    closeExtraWindows();
  }
}

function cleanWindowSelections() {
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
  if (mapWindowMessenger) {
    mapWindowMessenger = null;
  }
  if (puckWindowMessenger) {
    puckWindowMessenger = null;
  }
  if (secondscreenWindowMessenger) {
    secondscreenWindowMessenger = null;
  }
  closeExtraWindows();
  ipcMain.removeAllListeners();
  mapWindow = null;
  puckWindow = null;
  secondWindow = null;
  createWindows();
}

function isWindowSet(winWebContents: Electron.WebContents) {
  if (mapWindow && mapWindow.webContents === winWebContents) {
    mapWindow.webContents.send('window-is-set', { windowName: "map" });
  } else if (secondWindow && secondWindow.webContents === winWebContents) {
    secondWindow.webContents.send('window-is-set', { windowName: "secondscreen" });
  } else if (puckWindow && puckWindow.webContents === winWebContents) {
    puckWindow.webContents.send('window-is-set', { windowName: "puck" });
  }
}

function shiftPuckScreen(direction: string) {
  if (mapWindow && puckWindow) {
    const mx = mapWindow.getPosition()[0];
    const my = mapWindow.getPosition()[1];
    const mw = mapWindow.getSize()[0];
    const mh = mapWindow.getSize()[1];
    const pw = puckWindow.getSize()[0];
    const ph = puckWindow.getSize()[1];
    if (direction == 'left') {
      puckWindow.setSize(pw - 2, ph);
      mapWindow.setSize(mw + 2, mh);
      mapWindow.setPosition(mx - 2, my)
      configFile.puckWindowWidth -= 2
      saveConfigFile();
    } else if (direction == 'right') {
      puckWindow.setSize(pw + 2, ph);
      mapWindow.setSize(mw - 2, mh);
      mapWindow.setPosition(mx + 2, my)
      configFile.puckWindowWidth += 2;
      saveConfigFile();
    }
  }
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

function setupPuckWindow() {
  const x = mapWindow.getPosition()[0];
  const y = mapWindow.getPosition()[1];
  const w = mapWindow.getSize()[0];
  const h = mapWindow.getSize()[1];
  mapWindow.setFullScreen(false);
  mapWindow.setSize(w - configFile.puckWindowWidth, h);
  mapWindow.setPosition(x + configFile.puckWindowWidth, y);
  puckWindow = new BrowserWindow({
    x: x,
    y: y,
    width: configFile.puckWindowWidth,
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

function saveConfigProperty(obj, path, value)  {
  if (path.length === 1) {
    obj[path] = value
    console.log(JSON.stringify(configFile));
    saveConfigFile();
    return
  }
  return saveConfigProperty(obj[path[0]], path.slice(1), value)
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    loadConfigFile().then(data => {
      createWindows();
    });

  });

} catch (e) {
  // Catch Error
  // throw e;
}
