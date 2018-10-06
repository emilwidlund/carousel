const {app, BrowserWindow} = require('electron');

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
})

app.on('ready', () => {
    let mainWindow = new BrowserWindow({
        title: 'Carousel',
        width: 1360,
        height: 800
    });

    mainWindow.loadFile(`./dist/index.html`);

    mainWindow.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});