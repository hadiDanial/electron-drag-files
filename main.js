const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        },
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle("copy-file", async (_, fileParams) => {
    const fileToCopy = fileParams.fileToCopy;
    const copiedFilePath = fileParams.copiedFilePath;

    const dir = path.join(__dirname, '//copied-files//');
    fs.copyFileSync(fileToCopy, dir + copiedFilePath);
})
