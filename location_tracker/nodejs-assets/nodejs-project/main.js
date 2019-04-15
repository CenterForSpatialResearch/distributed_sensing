// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

var rn_bridge = require('rn-bridge');
var hypercore = require('./hypercore')
var hyperdiscovery = require('./hyperdiscovery')

var feed = null
var swarm

const send = (msg) => {
    rn_bridge.channel.send(msg)
}
const initialize = () => {
    feed = hypercore(rn_bridge.app.datadir(), {valueEncoding: 'json'})
    feed.on("ready", function(){
    	send("key: "+ feed.key.toString("hex"))
    	swarm = hyperdiscovery(feed)
    	swarm.on("connection", function(peer, type){
    		send("we have a connection")
            peer.on('close', function () {
                send('peer disconnected')
            })
    	})
    })
    return
}

const addFeed = (msg) => {
    feed.append(msg)
    let string = 'Appended block, ' + feed.length+ ' blocks in total ('+feed.byteLength+' bytes)\n'
    rn_bridge.channel.send(string);
}

// Echo every message received from react-native.
rn_bridge.channel.on('message', (msg) => {
    try {
        switch(msg.type) {
            case 'init':
                initialize()
                // rn_bridge.channel.send("Initialized the feed");
                rn_bridge.channel.post("initialize", JSON.stringify({fake:'obj'}))
                break;
            case 'add':
                addFeed(msg);
                rn_bridge.channel.send("Attempt to add "+ msg.uuid + " to hypercore");
                break;
            case 'get':
                send('get requested');
                if (feed!=null){
                    feed.get(0, (err,data) => {send(JSON.stringify(data))})
                }
                // send(feed.getBatch(Math.max(end-100+1, 0), end));
                break;
            default:
                rn_bridge.channel.send("unknown request:\n" + msg);
                break;
        }
    } catch (err) {
        rn_bridge.channel.send("Error: " + JSON.stringify(err) + " => " + err.stack );
    }
});
rn_bridge.channel.on('read', () => {
    if (feed!=null){
        let end = feed.length-1;
        // feed.getBatch(Math.max(end-100+1, 0), end)
        feed.getBatch(Math.max(end-100+1,0), end, (err,data) => {

            // let retval = []
            // for (let d in data){
            //     retval.push([d.coords.longitude,d.coords.latitude])
            // }

            rn_bridge.channel.post("dataDump", JSON.stringify(data))
                // send(feed.getBatch(Math.max(end-100+1, 0), end));

        })
    } else{
        send("feed is null")
    }
})

// Inform react-native node is initialized.
rn_bridge.channel.send("node was initialized.");
