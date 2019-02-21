#!/usr/bin/env node

'use strict'

const http = require('http')
const port = 5280

const requestHandler = (request, response) => {
    console.log(request)
    if (request.method == 'POST') {
        let body = ''
        request.on('data', (data) => {
            body += data
        })
        request.on('end', () =>  {
            console.log(body)
        })
    }

    response.end('Hello world')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log('Listening on port ' + port)
})


// curl http://localhost:5280 --data "{'t_utc': 1234}"
// echo "hi" > /dev/tcp/localhost/5280

// const hypercore = require('hypercore')
// const hyperdiscovery = require('hyperdiscovery')

// const feed = hypercore('./data', {valueEncoding: 'json'}) // use disk 
// let swarm

// feed.on('ready', function() {    

//     console.log('PUBLIC_KEY\t', feed.key.toString('hex'))
//     console.log('DISCOVERY_KEY\t', feed.discoveryKey.toString('hex'))
//     console.log()

//     swarm = hyperdiscovery(feed)
//     console.log('SWARM INFO', '\nDNS', swarm._options.dns, '\nDHT', swarm._options.dht, '\nPORT', swarm._options.port, '\n')
//     console.log('Connecting to swarm as ' + swarm.id.toString('hex'))
//     console.log()

//     swarm.on('connection', function(connection, peer) {

//         console.log('Connected\t' + peer.id.toString('hex') + '\t(' + peer.type + ' '+ peer.host + ':' + peer.port + ')')
        
//         connection.on('close', function() {
//             console.log('Disconnected\t' + peer.id.toString('hex') + '\t(' + peer.type + ' '+ peer.host + ':' + peer.port + ')')
//         })

//     })

//     setInterval(function() {
//         let datum = + new Date()
//         feed.append(datum)
//         console.log(datum)
//     }, 1000)

// })

// feed.on('error', function(err) {
//     console.log(err)
// })




/*

https://stackoverflow.com/questions/4681067/how-do-i-run-a-node-js-application-as-its-own-process/28542093#28542093


*/