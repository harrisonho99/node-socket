var WebSocketServer = require('websocket').server;
var http = require('http');
const fs = require('fs');
const path = require('path');
var server = http.createServer(function (_, response) {
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
    response.end();
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
  var connection = request.accept(null, '*');
  const dataPath = path.join(__dirname, 'message.json');
  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('open', () => {
    console.log('open connection');
  });
  connection.on('message', function (data) {
    if (data.type === 'utf8') {
      // process WebSocket message
      switch (data.utf8Data) {
        case '':
          fs.readFile(dataPath, (err, data) => {
            if (!err) {
              return connection.send(data.toString());
            }
          });
          break;
        default:
          const message = {
            time: Date.now(),
            text: data.utf8Data,
          };

          fs.readFile(dataPath, (err, fileData) => {
            if (err) {
              const stringJSON = JSON.stringify([message]);
              return fs.writeFile(dataPath, stringJSON, (err) => {
                if (err) throw err;
                connection.send(stringJSON);
              });
            }
            const list = JSON.parse(fileData);
            list.push(message);
            stringedJson = JSON.stringify(list);
            fs.writeFile(dataPath, stringedJson, (err) => {
              if (err) throw err;
              connection.send(stringedJson);
            });
          });
          break;
      }
    }
  });

  connection.on('close', function (connection) {
    // close user connection
    console.log('connection closed!');
  });
});
