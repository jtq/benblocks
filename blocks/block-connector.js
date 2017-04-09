var EventSource = require('https://github.com/jtq/event-source/blob/master/index.js');

function BlockConnector(serial, txPin, rxPin, /*announcePin,*/ listenPin) {

  this.SOT = '\u0002';
  this.EOT = '\u0004';


  this.serial = serial;
  this.tx = txPin;
  this.rx = rxPin;
  /*this.connectionAnnounce = announcePin;*/  // 3.3v pin
  this.connectionListen = listenPin;

  this.connectTimerId = null;
  this.disconnectTimerId = null;

  this.buffer = ''; // Buffer for de-chunking incoming serial data

  EventSource.call(this); // Set up event-handling using a mixin

  // Set up connect/disconnect watchers
  pinMode(this.connectionListen, 'input_pulldown');

  // Detect connection
  setWatch(function(e) {
    if(!this.connectTimerId) {
      this.connectTimerId = setTimeout(function() {
        this.connectTimerId = null;
        if(digitalRead(this.connectionListen) === 1) { // Check for debounce issues
          //console.log('BlockConnector: connected');
          this.fire('connect', e);
        }
      }.bind(this), 500);   // Wait for debounce and then check empirically whether connection exists
    }
  }.bind(this), this.connectionListen, { repeat: true, edge: 'rising' });  // On connection, output block data

  // Detect disconnection
  setWatch(function(e) {
    if(!this.disconnectTimerId) {
      this.disconnectTimerId = setTimeout(function() {
        this.disconnectTimerId = null;
        if(digitalRead(this.connectionListen) === 0) {
          //console.log('BlockConnector: disconnected');
          this.buffer = '';
          this.fire('disconnect', e);
        }
      }.bind(this), 500);   // Wait for debounce and then check empirically whether connection exists
    }
  }.bind(this), this.connectionListen, { repeat: true, edge: 'falling'});

  // Set up serial comms port for actual data comms
  this.serial.setup(115200, { tx:this.tx, rx:this.rx });  // Data connection
  this.serial.on('data', function(data) {
    this.processDataChunk(data);
  }.bind(this));
}

BlockConnector.prototype.sendObject = function(obj) {
  var strRepresentation = JSON.stringify(obj);
  this.serial.print(this.SOT);
  this.serial.print(strRepresentation);
  this.serial.print(this.EOT);
};

// Data received through serial connection
BlockConnector.prototype.processDataChunk = function(data) {
  var sOTIndex = data.indexOf(this.SOT);
  var eOTIndex = data.indexOf(this.EOT);
  var messageStart = sOTIndex === -1 ? 0 : sOTIndex+1;
  var messageEnd = eOTIndex === -1 ? data.length : eOTIndex;

  if(E.getErrorFlags().indexOf("FIFO_FULL") !== -1) {
    console.log("Error - FIFO buffer overflow");
  }

  if(sOTIndex !== -1) { // If data includes SOT, replace existing buffer
    this.buffer = data.substring(messageStart, messageEnd);
  }
  else {    // Else append to buffer
    this.buffer += data.substring(messageStart, messageEnd);
  }

  if(eOTIndex !== -1) {
    try {
      var obj = JSON.parse(this.buffer);
      if(obj) {
        this.fire('objectReceived', obj);
      }
      else {
        throw new Error("Could not parse buffer as valid JSON");
      }
    }
    catch(e) {
      console.log("Error parsing message (" + e.toString() + ") -->", this.buffer, "<--");
    }
    this.buffer = '';
  }
};



module.exports = BlockConnector;