'use strict'

const path = require('path')
const fs = require('fs')

let hypercore = require('hypercore')
let hyperdiscovery = require('hyperdiscovery')

let subscribe = (key, name, callback) => {

    console.log(`Subcribing to (${name}) ${key}`)

    let filepath = path.join(__dirname, '..', 'data', key)
    if (fs.existsSync(filepath)) return
    let feed = hypercore(filepath, key, {valueEncoding: 'json'})
    feed.on('ready', function() {
        fs.writeFileSync(path.join(filepath, 'name'), name)
        feed.close()
        callback()
    })
}


let fetch = (key, callback) => {

    console.log(`Fetching data for ${key}`)

    let filepath = path.join(__dirname, '..', 'data', key)
    let feed = hypercore(filepath, key, {valueEncoding: 'json'})
    let swarm

    feed.on('ready', () => {
        // console.log('DAT\tpublic_key\t' + feed.key.toString('hex'))
        swarm = hyperdiscovery(feed)
        // console.log('DAT\tconnecting as\t' + swarm.id.toString('hex'))
        swarm.on('connection', function(connection, peer) {
            // console.log('DAT\tconnected to\t' + peer.id.toString('hex') + '\t(' + peer.type + ' '+ peer.host + ':' + peer.port + ')')    
            connection.on('close', function() {
                // console.log('DAT\tdisconn from\t' + peer.id.toString('hex') + '\t(' + peer.type + ' '+ peer.host + ':' + peer.port + ')')
            })
            feed.download({start: 0, end: feed.length}, (e) => {
                if (e) {
                    return console.log(e)
                }
                console.log('--> success')
                feed.close((e) => {
                    if (e) {
                        return console.log(e)
                    }
                    callback()
                })
            })            
        })        
    })
}


module.exports = {fetch: fetch, subscribe: subscribe}