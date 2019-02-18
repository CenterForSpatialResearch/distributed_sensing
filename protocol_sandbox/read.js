'use strict'

let ram = require('random-access-memory')
let hypercore = require('hypercore')
let hyperdiscovery = require('hyperdiscovery')

const PUBLIC_KEY = process.argv[2]

let feed = hypercore(ram, PUBLIC_KEY, {valueEncoding: 'json'})
let swarm

feed.on('ready', function() {

    console.log('PUBLIC_KEY\t', feed.key.toString('hex'))
    console.log('DISCOVERY_KEY\t', feed.discoveryKey.toString('hex'))
    console.log()

    swarm = hyperdiscovery(feed)
    console.log('SWARM INFO', '\nDNS', swarm._options.dns, '\nDHT', swarm._options.dht, '\nPORT', swarm._options.port, '\n')
    console.log('Connecting to swarm as ' + swarm.id.toString('hex'))
    console.log()    

    swarm.on('connection', function(connection, peer) {

        console.log('Connected\t' + peer.id.toString('hex') + '\t(' + peer.type + ' '+ peer.host + ':' + peer.port + ')')
        
        connection.on('close', function() {
            console.log('Disconnected\t' + peer.id.toString('hex') + '\t(' + peer.type + ' '+ peer.host + ':' + peer.port + ')')
        })

    })

})

// create a readStream so that we can log all of the data we get from the peers we connect with
// 'start: 0' makes the stream start at the beginning of the log
// 'live: true' keeps the stream open after the last bit of data has been read, yielding more data as it comes in
let stream = feed.createReadStream({start: 0, live: true})
stream.on("data", function(data) {
    console.log("data", data)
})