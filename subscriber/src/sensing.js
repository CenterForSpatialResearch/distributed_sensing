'use strict'

const path = require('path')
const fs = require('fs')

const hypercore = require('hypercore')
const hyperdiscovery = require('hyperdiscovery')

const subscribe = (key, name, callback) => {
    console.log(`Subscribing to (${name}) ${key}`)
    let filepath = path.join(__dirname, '..', 'data', key)
    if (fs.existsSync(filepath)) return callback()
    let feed = hypercore(filepath, key, {valueEncoding: 'json'})
    feed.on('ready', () => {
        fs.writeFileSync(path.join(filepath, 'name'), name)
        feed.close(() => {
            console.log('--> feed successfully closed')
            callback()
        })
    })
}

const fetch = (key, callback) => {

    console.log(`Fetching data for ${key}`)

    const filepath = path.join(__dirname, '..', 'data', key)
    const feed = hypercore(filepath, key, {valueEncoding: 'json'})
    let swarm

    feed.on('ready', () => {
        console.log('--> ready')
        swarm = hyperdiscovery(feed)
        let downloading = false
        swarm.on('connection', async (connection, peer) => {            // what to do if doesn't connect?
            console.log('--> connected')
            connection.on('close', () => {
                console.log('--> disconnected')
            })
            if (!downloading) {
                downloading = true                
                console.log('--> feed length', feed.length)                
                await sleep(200)       // this should not be necessary, but the ready event isnt populated
                console.log('--> feed length', feed.length)
                console.log('--> readable?', feed.readable)
                if (feed.readable && feed.length > 0) {        
                    feed.download({start: 0, end: feed.length}, (e) => {
                        if (e) {
                            return console.log(e)
                        }
                        console.log('--> fetch complete')
                        feed.close((e) => {
                            if (e) {
                                return console.log(e)
                            }
                            console.log('--> feed successfully closed')                    
                            swarm.close()    
                            callback()                
                        })
                    })                  
                } else {
                    console.log('--> not readable or 0 length')
                    feed.close((e) => {
                        if (e) {
                            return console.log(e)
                        }
                        console.log('--> feed successfully closed')                    
                        swarm.close()    
                        callback()                
                    })
                }        

            }
        })        
    })

}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {fetch: fetch, subscribe: subscribe}