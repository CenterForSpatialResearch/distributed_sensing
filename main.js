"use strict"

console.log('hello world ping')

let ram = require('random-access-memory')
let hypercore = require('hypercore')
let net = require('net')
let swarm = require('webrtc-swarm')
let signalhub = require('signalhub')


// create feed
let feed = hypercore(function(filename) {
	return ram()
}, {valueEncoding: 'utf-8'})


feed.on('ready', function () {    
    console.log('feed ready')
    let hub = signalhub(feed.discoveryKey.toString('hex'), ['https://signalhub.mafintosh.com'])
    let sw = swarm(hub)
 
    sw.on('peer', function (peer, id) {
        console.log('connected to a new peer:', id)
        peer.pipe(feed.replicate({encrypt: false})).pipe(peer)
    })
})


feed.append('hello')
feed.append('world', function(err) {
    if (err) throw err
    console.log('appended')
    feed.get(0, function(err, data) {
        if (err) throw err
        console.log(data)
    })
})





// let socket = net.connect(5280)
// socket.pipe(feed.replicate()).pipe(socket)

/*

ok, so this hooks up to the geo-ping thing. so we just get a feed of pings.

but are we using wrtc? or? how and where do I connect to this feed?

*/