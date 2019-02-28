#!/usr/bin/env node

'use strict'

const port = 5280

const http = require('http')
const hypercore = require('hypercore')
const hyperdiscovery = require('hyperdiscovery')

const feed = hypercore('./data', {valueEncoding: 'json'}) // use disk 
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

feed.on('error', function(err) {
    console.log(err)
})

const requestHandler = (request, response) => {    
    if (request.method == 'POST') {
        let body = ''
        request.on('data', (data) => {
            body += data
        })
        request.on('end', () =>  {
            let obj
            try {
                obj = JSON.parse(body)
                if (obj.t_utc == undefined) {
                    obj.t_utc = new Date().getTime() / 1000
                }
            } catch(err) {
                response.statusCode = 400
                console.log('HTTP\terror: ' + err.message)
                console.log(body)
                response.end('HTTP\terror: ' + err.message + '\n')
                return
            }
            console.log('HTTP\t' + request.connection.remoteAddress + '\t\t', obj)
            feed.append(JSON.stringify(obj))
            response.end('OK\n')
        })
    }    
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('SERVICE\terror ' + err)
    }
    console.log('HTTP\tlistening on port ' + port)
})


// curl http://localhost:5280 --data '{"latitude": 1234, "longitude": 5678}'
