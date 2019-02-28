'use strict'

let ram = require('random-access-memory')
let hypercore = require('hypercore')
let hyperdiscovery = require('hyperdiscovery')

const PUBLIC_KEY = process.argv[2]

let feed = hypercore(ram, PUBLIC_KEY, {valueEncoding: 'json'})
// let feed = hypercore('./remote_data', PUBLIC_KEY, {valueEncoding: 'json'})
let swarm

feed.on('ready', function() {

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


/*

tab to different keys.

I want to see this on a mapbox map. so integrating that would be great.

*/