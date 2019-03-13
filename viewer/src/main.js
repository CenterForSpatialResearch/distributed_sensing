const { app, BrowserWindow } = require('electron')
const express = require('express')
const main = express()
const mustacheExpress = require('mustache-express')
const path = require('path')
const port = 3000

main.use(express.static(__dirname + '/../static'));
main.engine('html', mustacheExpress())
main.set('view engine', 'mustache')
main.set('views', __dirname + '/../templates')
main.listen(port, () => console.log(`Example app listening on port ${port}!`))

let window

function createWindow () {
    window = new BrowserWindow({ width: 1024, height: 800, resizable: false, show: false, webPreferences: {nodeIntegration: false, nodeIntegrationInWorker: false} })
    // window.loadFile('templates/index.html')
    window.loadURL('http://localhost:3000')
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
    response.render('index.html')
})

main.get('/farts', function (request, response) {
    response.send('HA')
})

// POST method route
main.post('/', function (request, response) {
    response.send('POST request to the homepage')
})

