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

/*

ok, so this hooks up to the geo-ping thing. so we just get a feed of pings.

but are we using wrtc? or? how and where do I connect to this feed?

https://pfrazee.hashbase.io/blog/hyperswarm
https://github.com/karissa/hyperdiscovery
in essence this is the same as beakerbrowser, right? no. beakerbrowser is not _in_ the browser.
which is why we have to use webrtc and not hyperdiscovery (summer 18) or hyperswarm (9/18). maybe.

https://github.com/mafintosh/webrtc-swarm
https://github.com/mafintosh/signalhub

have to host own signalhub to allow discovery, and then we have multiple web clients.

so first step, get a mirrored location going, producer/consumer
the browser could be the bridge, as insane as that is. which is what the Elektron project does, no?

this doesnt really work until there is a discovery mechanism that works both client and server. but I think we can bet on that happening.

so C4SR serves as a signalhub and as a replication gateway. which is not nothing. but it has the feature that everything could be replicated off of it, given the keys. (is that possible in bulk?)

//

questions: can we delete data in the source feed?

*/
