
var websocket = { 
  upstream: 0,
  downstream: 0,
  lat: 0,
  socket: undefined,

  init: function() {
    this.socket = io();
    this.socket.on('connect', function () { 
      console.log("websocket connected to localhost");
    });

    this.socket.on('pong', function(data) {
      websocket.lat = (new Date()) - this.start;
    });

    this.socket.on('downstream', function(data) {
      this.downloadBytes += Object.keys(data).length;
      var downstream = (this.downloadBytes / (new Date() - this.downloadStart)).toString();
      console.log("downstream", downstream);
      websocket.downstream = downstream;
    });

    setInterval(function() {
      websocket.latency();
    }, 1000);

    setTimeout(function() {
      websocket.download();
    }, 1000);
    
    setTimeout(function() {
      var data = testdata.getData(0.1);
      websocket.upload(5000, data);
    }, 12000);
  },

  latency: function() {
    this.socket.latencyStart = new Date();
    this.socket.emit('ping', '', function(data){
      var latency = new Date() - this.latencyStart;
      websocket.lat = latency;
      console.log("websocket.lat =", websocket.lat);
    });
  },

  download: function() {
    this.socket.downloadStart = new Date();
    this.socket.downloadBytes = 0;
    console.log("starting download test");
    this.socket.emit('start download');
  },

  upload: function(testTimeInMilliseconds, data) {
    this.socket.uploadStart = new Date();
    this.socket.uploadBytes = 0;
    console.log("starting upload test");

    var interval = setInterval(function() {
      var time = new Date();
      if((time - websocket.socket.uploadStart) < testTimeInMilliseconds) {
        websocket.socket.emit('upstream', data, function(data) {
          this.uploadBytes += data;
          var upstream = (this.uploadBytes / (new Date() - this.uploadStart)).toString();
          console.log("upstream", upstream);
          websocket.upstream = upstream;
        });
      }
      else {
        clearInterval(interval);
      }
    }, 100);
  }
};

var testdata = {
  getData: function(sizeInMB) {
    var data = new Uint8Array(Math.round(sizeInMB * 1024 * 1024));
    for (var i = 0; i < data.length; i++) {
      data[i] = 32 + Math.random() * 95;
    }
    console.log("generated", data.length, "bytes of data");
    return data;
  }
};

websocket.init();