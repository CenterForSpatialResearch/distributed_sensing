"use strict"

console.log('hello world ping')

let ram = require('random-access-memory')
let hypercore = require('hypercore')
let net = require('net')
let swarm = require('webrtc-swarm')
let signalhub = require('signalhub')

if (swarm.WEBRTC_SUPPORT) {
    console.log('webrtc is supported')
} else {
    console.log('websrtc not supported!')
}

// create feed
let feed = hypercore(function(filename) {
	return ram()
}, {valueEncoding: 'utf-8'})


feed.on('ready', function () {    
    console.log('feed ready')    

    let hub = signalhub(feed.discoveryKey.toString('hex'), ['https://signalhub.mafintosh.com'])
    let sw = swarm(hub)
 
    sw.on('connect', function(peer, id) {
        console.log('connected to a new peer:', id)
        console.log('total peers:', sw.peers.length)        
        peer.pipe(feed.replicate({encrypt: false})).pipe(peer)
    })

    sw.on('disconnect', function(peer, id) {
        console.log('disconnected from a peer:', id)
        console.log('total peers:', sw.peers.length)
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


