console.log("Loading peer.js");

const node = new window.Ipfs()

node.on('ready', () => {


});



// var ipfs = new Ipfs({
//     repo: "ipfs/shared",
//     config: {
//         "Bootstrap": [
//         // Leave this blank for now. We'll need it later
//         ]
//     },
//     EXPERIMENTAL: {
//           pubsub: true // OrbitDB requires pubsub
//     }
// });

// ipfs.once('ready', async function() {
//     var ipfsId = await ipfs.id();
//     var orbitdb = new OrbitDB(ipfs)
//     window.globaldb = await window.orbitdb.log(ipfsId.publicKey);
//     await globaldb.load();
// });
