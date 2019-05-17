'use strict'

const { app, BrowserWindow } = require('electron')

const fs = require('fs')
const path = require('path')
const del = require('del')
const lineReader = require('line-reader')

const hypercore = require('hypercore')
const sensing = require('./sensing')

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

main.get('/data/:key', (request, response) => {
    console.log('/data')
    let key = request.params.key
    let filepath = path.join(__dirname, '..', 'data', key, 'data')
    let data = []
    if (fs.existsSync(filepath)) {    
        lineReader.eachLine(filepath, (line, last) => {
            let d = JSON.parse(line)
            if (typeof d === 'string') {
                try {
                    d = JSON.parse(d)
                } catch (e) {}
            }
            data.push(d)
            if (last) {
                console.log(data)
                response.json(data)
            }
        })
    } else {
        response.json(data)
    }
})

main.post('/subscribe', (request, response) => {
    console.log(`/subscribe`)        
    let key = request.body.key
    let name = request.body.name
    sensing.subscribe(key, name, () => {
        response.send('OK')
    })
})

main.post('/unsubscribe', (request, response) => {
    console.log(`/unsubscribe`)    
    let key = request.body.key
    console.log(`Unsubcribing from ${key}`)
    let filepath = path.join(__dirname, '..', 'data', key)
    if (!fs.existsSync(filepath)) return
    del.sync(filepath)
    response.send('OK')
})

main.post('/fetch', (request, response) => {
    console.log(`/fetch`)
    let key = request.body.key
    sensing.fetch(key, () => {
        response.send('OK')         // needs to trigger a pinwheel that's stopped by some other callback later
    })
})

