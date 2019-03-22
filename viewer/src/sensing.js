'use strict'

const path = require('path')
const fs = require('fs')
const hypercore = require('hypercore')

// const hypercore = require('hypercore')
const hyperdiscovery = require('hyperdiscovery')

const subscribe = (key, name, callback) => {

    console.log(`Subcribing to (${name}) ${key}`)

    let filepath = path.join(__dirname, '..', 'data', key)
    if (fs.existsSync(filepath)) return
    let feed = hypercore(filepath, key, {valueEncoding: 'json'})
    feed.on('ready', function() {
        fs.writeFileSync(path.join(filepath, 'name'), name)
        feed.close(() => {
            console.log('--> feed successfully closed')
            callback()
        })
    })
}


const fetch = (key) => {

    console.log(`Fetching data for ${key}`)

    const filepath = path.join(__dirname, '..', 'data', key)
    const feed = hypercore(filepath, key, {valueEncoding: 'json'})
    let swarm

    feed.on('ready', () => {
        // console.log('DAT\tpublic_key\t' + feed.key.toString('hex'))
        swarm = hyperdiscovery(feed)
        // console.log('DAT\tconnecting as\t' + swarm.id.toString('hex'))
        swarm.on('connection', function(connection, peer) {
            console.log('--> connected')
            // console.log('DAT\tconnected to\t' + peer.id.toString('hex') + '\t(' + peer.type + ' '+ peer.host + ':' + peer.port + ')')    
            connection.on('close', function() {
                // console.log('DAT\tdisconn from\t' + peer.id.toString('hex') + '\t(' + peer.type + ' '+ peer.host + ':' + peer.port + ')')
            })    
        })        
        console.log('--> feed length', feed.length)
        console.log('--> readable?', feed.readable)
        if (feed.readable) {        
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
                })
            })                  
        } else {
            console.log('--> something went wrong')
        }        
    })

    // let stream = feed.createReadStream({start: 0, end: feed.length, live: false, wait: true}) // start at index 0, and keep live to receive new info
}


module.exports = {fetch: fetch, subscribe: subscribe}