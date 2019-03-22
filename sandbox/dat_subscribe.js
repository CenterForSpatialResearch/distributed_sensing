'use strict'

let ram = require('random-access-memory')
let hypercore = require('hypercore')
let hyperdiscovery = require('hyperdiscovery')

const PUBLIC_KEY = "7beceb5a7f831267a5f0772181b3bf361d7050453a00f918f0c7af5e596a5af5"

// let feed = hypercore(ram, PUBLIC_KEY, {valueEncoding: 'json'})
let feed = hypercore('./data/' + PUBLIC_KEY, PUBLIC_KEY, {valueEncoding: 'json'})
let swarm

feed.on('ready', function() {

    console.log("feed length", feed.length)

    console.log('DAT\tpublic_key\t' + feed.key.toString('hex'))
    // console.log('DAT\tdiscovery_key\t', feed.discoveryKey.toString('hex'))
    // console.log()

    swarm = hyperdiscovery(feed)
    // console.log('SWARM INFO', '\nDNS', swarm._options.dns, '\nDHT', swarm._options.dht, '\nPORT', swarm._options.port, '\n')
    console.log('DAT\tconnecting as\t' + swarm.id.toString('hex'))

    swarm.on('connection', function(connection, peer) {
        console.log('DAT\tconnected to\t' + peer.id.toString('hex') + '\t(' + peer.type + ' '+ peer.host + ':' + peer.port + ')')    
        connection.on('close', function() {
            console.log('DAT\tdisconn from\t' + peer.id.toString('hex') + '\t(' + peer.type + ' '+ peer.host + ':' + peer.port + ')')
        })
    })

})

let stream = feed.createReadStream({start: 0, live: true}) // start at index 0, and keep live to receive new info
stream.on('data', function(data) {
    console.log(data)
})
