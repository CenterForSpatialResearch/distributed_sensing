const { app, BrowserWindow } = require('electron')

let win

function createWindow () {
    win = new BrowserWindow({ width: 1024, height: 800, resizable: false, show: false })
    win.loadFile('index.html')
    // win.webContents.openDevTools()
    win.once('ready-to-show', () => {
      win.show()
    })
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
