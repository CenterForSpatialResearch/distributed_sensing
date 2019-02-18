'use strict'

let ram = require('random-access-memory')
let hypercore = require('hypercore')
let hyperdiscovery = require('hyperdiscovery')

// let feed = hypercore(ram, {valueEncoding: 'json'})   // use ram
let feed = hypercore('./data', {valueEncoding: 'json'}) // use disk 
let swarm

feed.on('ready', function() {    

    console.log('PUBLIC_KEY\t', feed.key.toString('hex'))
    console.log('DISCOVERY_KEY\t', feed.discoveryKey.toString('hex'))
    console.log()

    swarm = hyperdiscovery(feed)
    console.log('SWARM INFO', '\nDNS', swarm._options.dns, '\nDHT', swarm._options.dht, '\nPORT', swarm._options.port, '\n')
    console.log('Connecting to swarm as ' + swarm.id.toString('hex'))
    console.log()

    swarm.on('connection', function (connection, peer) {

        console.log('Connected\t' + peer.id.toString('hex') + '\t(' + peer.type + ' '+ peer.host + ':' + peer.port + ')')
        
        connection.on('close', function() {
            console.log('Disconnected\t' + peer.id.toString('hex') + '\t(' + peer.type + ' '+ peer.host + ':' + peer.port + ')')
        })

    })

    setInterval(function() {
        let datum = + new Date()
        feed.append(datum)
        console.log(datum)
    }, 1000)

})

feed.on('error', function(err) {
    console.log(err)
})



// prevent prior accessing prior elements in the feed?