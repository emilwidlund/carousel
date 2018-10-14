const {app, ipcMain, BrowserWindow} = require('electron');

const server = require('./server');

let mainWindow;
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
        height: 800
    });

    mainWindow.loadFile('./dist/index.html');

    if (!app.isPackaged) {
        mainWindow.openDevTools();
    }    

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

ipcMain.on('start-preview', (event, arg) => {
    if (projectServerRunning) return;

    server.start(arg, () => {
        projectServerRunning = true;

        let previewWindow = new BrowserWindow({
            title: 'Preview',
            width: 1360,
            height: 800,
            parent: mainWindow,
            experimentalFeatures: true,
            autoHideMenuBar: true
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