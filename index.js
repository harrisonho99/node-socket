var WebSocketServer = require('websocket').server;
var http = require('http');
const fs = require('fs');
const path = require('path');
var server = http.createServer(function (request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
  fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
    if (err) {
      console.log(err);
      response.statusCode = 500;
      response.write('some thing went wrong!');
      return response.end();
    }
    response.write(data);
  });
});
server.listen(3000, function () {
  console.log('listen port 3000');
});

// create the server
wsServer = new WebSocketServer({
  httpServer: server,
});

// WebSocket server
wsServer.on('request', function (request) {
  var connection = request.accept(null, request.origin);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      // process WebSocket message
    }
    console.log(message);
  });

  connection.on('close', function (connection) {
    // close user connection
  });
});
