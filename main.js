const {app, ipcMain, dialog, BrowserWindow} = require('electron');
const path = require('path');

const server = require('./server');

// Setup User Analytics
const {trackEvent} = require('./analytics');
global.trackEvent = trackEvent;

let mainWindow;
let previewWindow;
let projectServerRunning;

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }

    trackEvent('Window', 'All Windows Closed');
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        title: 'Carousel',
        width: 1360,
        height: 800,
        icon: path.join(__dirname, 'dist/icons/png/64x64.png')
    });
    trackEvent('Window', 'Open', 'Main Window');

    mainWindow.loadFile('./dist/index.html');

    if (!app.isPackaged) {
        mainWindow.openDevTools();
        trackEvent('Window', 'Open Developer Tools', 'Main Window');
    }    

    mainWindow.on('close', (e) => {
        e.preventDefault();

        if (projectServerRunning) {
            previewWindow.destroy();
        }

        dialog.showMessageBox({
            type: 'warning',
            buttons: ['Save', 'Don\'t Save', 'Cancel'],
            message: 'Your project has not been saved. How do you want to proceed?',
            noLink: true
        }, (response) => {
            if (response === 0) {
                mainWindow.webContents.send('save-project');
                trackEvent('Window', 'Save Project On Close', 'Main Window');
            } else if (response === 1) {
                mainWindow.destroy();
                trackEvent('Window', 'Don\'t Save Project On Close', 'Main Window');
            } else {
                trackEvent('Window', 'Cancel On Close', 'Main Window');
            }
        });

    });

    mainWindow.on('close', () => {
        if (previewWindow) {
            previewWindow.destroy();
            trackEvent('Window', 'Inheritly Closed', 'Preview Window');
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
        trackEvent('Window', 'Closed', 'Main Window');
    });
});

ipcMain.on('start-preview', (event, arg) => {
    if (projectServerRunning) return;

    server.start(arg, () => {
        projectServerRunning = true;
        trackEvent('Project Server', 'Start');

        previewWindow = new BrowserWindow({
            title: 'Preview',
            width: 1360,
            height: 800,
            alwaysOnTop: true,
            experimentalFeatures: true,
            autoHideMenuBar: true,
            icon: path.join(__dirname, 'dist/icons/png/64x64.png')
        });
        trackEvent('Window', 'Open', 'Preview Window');
    
        previewWindow.loadURL('http://localhost:8010');

        if (!app.isPackaged) {
            previewWindow.openDevTools();
            trackEvent('Window', 'Open Developer Tools', 'Preview Window');
        }
    
        previewWindow.on('closed', () => {
            previewWindow = null;
            trackEvent('Window', 'Closed', 'Preview Window');

            projectServerRunning = false;
            server.close();
            trackEvent('Project Server', 'Closed', 'Preview Window');
        });

        mainWindow.on('closed', () => {
            projectServerRunning = false;
            server.close();
            trackEvent('Project Server', 'Closed', 'Main Window');
        });
    });
});