const { app, BrowserWindow } = require('electron')
const express = require('express')
const main = express()
const port = 3000

let window

function createWindow () {
    window = new BrowserWindow({ width: 1024, height: 800, resizable: false, show: false, nodeIntegration: true })
    window.loadFile('index.html')
    window.webContents.openDevTools()
    window.once('ready-to-show', () => {
      window.show()
    })
    window.on('closed', () => {
        window = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (window === null) {
        createWindow()
    }
})

// GET method route
main.get('/', function (request, response) {
    response.send('GET request to the homepage')
})

// POST method route
main.post('/', function (request, response) {
    response.send('POST request to the homepage')
})

main.listen(port, () => console.log(`Example app listening on port ${port}!`))