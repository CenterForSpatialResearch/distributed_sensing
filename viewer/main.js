const { app, BrowserWindow } = require('electron')

let main

function createWindow () {
    main = new BrowserWindow({ width: 1024, height: 800, resizable: false, show: false })
    main.loadFile('index.html')
    // main.webContents.openDevTools()
    main.once('ready-to-show', () => {
      main.show()
    })
    main.on('closed', () => {
        main = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (main === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

