/****
 * Hardware spec:
 *  Pins:
 *    Gnd: Gnd on other Pico
 *    3.3v: B3 on other Pico
 *    B3: 3.3v on other Pico
 *    B6: B7 on other Pico
 *    B7: B6 on other Pico
 */

/**** Define general "Output" block class, containing common connectivity setup/event-handling (to be moved into a separate module when possible) ****/
function OutputBlock(serialPort) {

  this.EOT = '\u0004';

  this.serialPort = serialPort;

  this.buffer = ''; // Buffer for de-chunking incoming serial data
}

OutputBlock.prototype.setBusy = function(busy) {
  digitalWrite(LED1, 0+busy);  // Red = busy
  digitalWrite(LED2, 0+(!busy));  // Green = waiting
};

OutputBlock.prototype.onData = function(data) { // Data received through serial connection
  this.setBusy(true);

  //console.log("Received", typeof data, data);

  this.buffer += data;  // De-chunk into buffer, and process whole buffer once EOT control character is received

  var eOTIndex = this.buffer.indexOf(this.EOT);

  console.log("Received chunk EOT index: ", eOTIndex, " -->", data, "<--");
  console.log("Total buffer -->", this.buffer, "<--");

  if(eOTIndex !== -1) { // ctrl+D - End of Transmission character
    try {
      var message = this.buffer.substring(0, eOTIndex);
      console.log("Message -->", message, "<--");
      this.processBuffer(message);
    }
    catch(e) {
      console.log("Error parsing buffer\nBuffer: -->", data, "<--");
    }
    finally {
      this.buffer = this.buffer.substring(eOTIndex+this.EOT.length, this.buffer.length);  // And reset buffer
      console.log("Remaining buffer -->", this.buffer, "<--");
      this.setBusy(false);
    }
  }
};

OutputBlock.prototype.processBuffer = function(buffer) {  // Process complete (de-chunked) data object
  // console.log('Buffer to process:', buffer);
};

OutputBlock.prototype.onDisconnect = function(e) {  // On loss of connection
  //console.log('Disconnect');
};

OutputBlock.prototype.setUp = function() {

  USB.setConsole();

  /**** Set up inputs ****/
  pinMode(B3, 'input_pulldown');  // Listen for connection from earlier block

  this.serialPort.setup(115200, { tx:B6, rx:B7 });  // Data connection
  this.setBusy(false);

  this.serialPort.on('data', this.onData.bind(this));

  setWatch(function(e) {
    setTimeout(function() {
      if(digitalRead(B3) === 0) {
        this.onDisconnect(e);
      }
    }.bind(this), 500);   // Wait for debounce and then check empirically whether connection exists
  }.bind(this), B3, { repeat: true, edge: 'falling', debounce:100 });

};

module.exports = OutputBlock;