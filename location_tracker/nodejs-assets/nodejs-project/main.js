var rn_bridge = require('rn-bridge');
var hypercore = require('./hypercore')
var hyperdiscovery = require('./hyperdiscovery')

var feed = null
var swarm

const send = (msg) => {
    rn_bridge.channel.send(msg)
}

const initialize = () => {
    return new Promise((resolve, reject) =>{
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
            resolve()
        })
        // if (feed!=null){
        // } else{
        //     reject()
        // }
        if (feed==null){
            reject()
        }
    })
}

const addFeed = (msg) => {
    feed.append(msg)
}


rn_bridge.channel.on('init',() => {
    initialize().then( () => rn_bridge.channel.post("is_initd"));
});

rn_bridge.channel.on('add',(data) => {
    addFeed(data);
});

//Get last 100 points
rn_bridge.channel.on('read', () => {
    if (feed!=null){
        let end = feed.length-1;
        feed.getBatch(Math.max(end-100+1,0), end, (err,data) => {
            rn_bridge.channel.post("dataDump", JSON.stringify(data))
        })
    } else{
        send("feed is null")
    }
})

// Inform react-native node is initialized.
rn_bridge.channel.send("node was initialized.");
