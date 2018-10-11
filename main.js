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

    mainWindow.loadURL('http://localhost:8000');

    // mainWindow.openDevTools();

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
    
        previewWindow.loadURL('http://localhost:8010');
    
        // previewWindow.openDevTools();
    
        previewWindow.on('closed', () => {
            previewWindow = null;
            server.close();
        });

        mainWindow.on('closed', () => {
            server.close();
        });
    });
});