const {app, ipcMain, dialog, BrowserWindow} = require('electron');
const path = require('path');
const temp = require('temp');

const server = require('./server');

let mainWindow;
let previewWindow;
let projectServerRunning;

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
})

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        title: 'Carousel',
        width: 1360,
        height: 800,
        icon: path.join(__dirname, 'dist/icons/png/64x64.png')
    });

    mainWindow.loadFile('./dist/index.html');

    if (!app.isPackaged) {
        mainWindow.openDevTools();
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
            } else if (response === 1) {
                mainWindow.destroy();
            }
        });

    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

ipcMain.on('start-preview', (event, arg) => {
    if (projectServerRunning) return;

    server.start(arg, () => {
        projectServerRunning = true;

        previewWindow = new BrowserWindow({
            title: 'Preview',
            width: 1360,
            height: 800,
            parent: mainWindow,
            experimentalFeatures: true,
            autoHideMenuBar: true,
            icon: path.join(__dirname, 'dist/icons/png/64x64.png')
        });
    
        previewWindow.loadURL('http://localhost:8010');

        if (!app.isPackaged) {
            previewWindow.openDevTools();
        }
    
        previewWindow.on('closed', () => {
            previewWindow = null;
            projectServerRunning = false;
            server.close();
        });

        mainWindow.on('closed', () => {
            projectServerRunning = false;
            server.close();
        });
    });
});