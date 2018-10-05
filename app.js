let net = require('net')

let server = net.createServer(function (socket) {
  socket.pipe(remoteFeed.replicate()).pipe(socket)
})

server.listen(5280)