var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var dlPacketSizeMB = 1;

var serverip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.get('/', function(req, res){
  console.log("index.html sent");
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

io.set("heartbeats", false);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('message', "Hello from server!");

  socket.on('ping', function (name, fn) {
    fn('got milk Ed');
  });

  socket.on('start download', function() {
    var start = new Date();
    var data = testdata.getData(dlPacketSizeMB);

    // Wild loop for 5 sec
    var interval = setInterval(function() {
      if((new Date() - start) < 5000) {
        socket.emit('downstream', data);
        console.log("ticking...");
      }
      else {
        clearInterval(interval);
        console.log("not ticking...");
      }
    }, 10);
  });

  socket.on('upstream', function (data, fn) {
    console.log("received upload data of", Object.keys(data).length, "bytes");
    fn(Object.keys(data).length);
  });
});

var testdata = {
  getData: function(sizeInMB) {
    var data = new Uint8Array(sizeInMB * 1024 * 1024);
    for (var i = 0; i < data.length; i++) {
      data[i] = 32 + Math.random() * 95;
    }
    console.log("generated", data.length, "bytes of data");
    return data;
  }
};

http.listen(3000, function(){
  console.log('listening on http://' + serverip +':3000');
});