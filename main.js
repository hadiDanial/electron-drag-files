const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs');
const https = require('https')

const fileCopyDestination = path.join(__dirname, '//copied-files//');
if(!fs.existsSync(fileCopyDestination))
    fs.mkdirSync(fileCopyDestination);

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

const iconName = path.join(__dirname, 'iconForDragAndDrop.png')
const icon = fs.createWriteStream(iconName)
https.get('https://img.icons8.com/ios/452/drag-and-drop.png', (response) => {
  response.pipe(icon)
})

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
    const fileName = fileParams.fileName;

    fs.copyFileSync(fileToCopy, fileCopyDestination + fileName);
})

ipcMain.handle("get-files-in-folder", async (_) => {
    let fileNames = []
    await fs.promises.readdir(fileCopyDestination).then((files) => {
        files.forEach(function (file) {
            fileNames.push(file);
        });
    }).catch(err => console.log(err));
    console.log("Names: " + fileNames);
    return fileNames;
})


ipcMain.handle("on-drag-start", async (event, fileName) => {
    event.sender.startDrag({
        file: fileCopyDestination + fileName,      
        icon: iconName  
    })
})

