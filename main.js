const {app, ipcMain, BrowserWindow} = require('electron');

const server = require('./server');

let mainWindow;

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

    mainWindow.openDevTools();

    mainWindow.loadFile('./dist/index.html');

    if (!app.isPackaged) {
        mainWindow.openDevTools();
    }    

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

ipcMain.on('start-preview', (event, arg) => {
    server.start(arg, () => {
        let previewWindow = new BrowserWindow({
            title: 'Preview',
            width: 1360,
            height: 800,
            parent: mainWindow,
            experimentalFeatures: true,
            autoHideMenuBar: true
        });

        previewWindow.openDevTools();
    
        previewWindow.loadURL('http://localhost:8010');

        if (!app.isPackaged) {
            previewWindow.openDevTools();
        }
    
        previewWindow.on('closed', () => {
            previewWindow = null;
            server.close();
        });

        mainWindow.on('closed', () => {
            server.close();
        });
    });
});