'use strict'

const { app, BrowserWindow } = require('electron')

const fs = require('fs')
const path = require('path')
const del = require('del')

const hypercore = require('hypercore')

const express = require('express')
const main = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const port = 3000

main.use(bodyParser.json())
main.use(bodyParser.urlencoded({extended: true}))
main.use(express.static(__dirname + '/../static'))
main.engine('html', mustacheExpress())
main.set('views', __dirname + '/../templates')
main.set('view engine', 'mustache')
main.listen(port)

let window

let createWindow = () => {
    window = new BrowserWindow({ width: 1024, height: 800, resizable: false, show: false, webPreferences: {nodeIntegration: false, nodeIntegrationInWorker: false} })
    window.loadURL('http://localhost:3000')
    window.openDevTools({mode: 'detach'})
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

main.get('/', (request, response) => {
    response.render('index.html')
})

main.get('/directory', (request, response) => {
    let directory = path.join(__dirname, '..', 'data')
    fs.readdir(directory, (err, items) => {
        if (err) {
            response.send('Data directory missing')
            return
        }
        let keys = []
        items.forEach((item) => {
            let filepath = path.join(directory, item)
            if (fs.lstatSync(filepath).isDirectory()) {
                let name = fs.readFileSync(path.join(filepath, 'name'), {encoding: 'utf-8'})
                keys.push({key: item, name: name})
            }
        })
        response.render('directory.html', {keys: keys})
    })    
})

main.get('/main/:key', (request, response) => {
    let key = request.params.key
    let name = fs.readFileSync(path.join(__dirname, '..', 'data', key, 'name'), {encoding: 'utf-8'})
    response.render('main.html', {key: key, name: name})
})

main.post('/subscribe', (request, response) => {
    let key = request.body.key
    let name = request.body.name
    console.log(`Subcribing to ${name}: ${key}`)
    let filepath = path.join(__dirname, '..', 'data', key)
    if (fs.existsSync(filepath)) return
    let feed = hypercore(filepath, key, {valueEncoding: 'json'})
    feed.on('ready', function() {
        fs.writeFileSync(path.join(filepath, 'name'), name)
        response.send('OK')
    })
})

main.post('/unsubscribe', (request, response) => {
    let key = request.body.key
    console.log(`Unsubcribing from ${key}`)
    let filepath = path.join(__dirname, '..', 'data', key)
    if (!fs.existsSync(filepath)) return
    del.sync(filepath)
    response.send('OK')
})

