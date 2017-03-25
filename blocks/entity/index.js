/****
 * Hardware spec:
 *  Pins:
 *    Gnd: Gnd on other Pico
 *    3.3v: B3 on other Pico
 *    B3: 3.3v on other Pico
 *    B6: B7 on other Pico
 *    B7: B6 on other Pico
 */

function EntityBlock(data, serialPort) {
  this.data = data;
  this.serialPort = serialPort;
}

EntityBlock.prototype.setBusy = function(busy) {
  digitalWrite(LED1, 0+busy);  // Red = busy
  digitalWrite(LED2, 0+(!busy));  // Green = waiting
};

EntityBlock.prototype.onConnect = function(e) {
  this.setBusy(true);

  var strRepresentation = JSON.stringify(this.data);
  //console.log("Connected - sending object", strRepresentation);
  this.serialPort.print(strRepresentation + '\u0004');

  this.setBusy(false);
};

EntityBlock.prototype.setUp = function() {

  USB.setConsole();

  /**** Set up inputs ****/

  pinMode(B3, 'input_pulldown');  // Listen for connection from later block

  /**** Set up outputs ****/

  this.serialPort.setup(28800, { tx:B6, rx:B7 });  // Data connection
  this.setBusy(false);                 // Display indicator

  /**** Behaviours ****/

  setWatch(function(e) {
    setTimeout(function() {
      if(digitalRead(B3) === 1) { // Check for debounce issues
        this.onConnect(e);
      }
    }.bind(this), 500);   // Wait for debounce and then check empirically whether connection exists
  }.bind(this),  B3, { repeat: true, edge: 'rising', debounce:100 });  // On connection, output block data
};

module.exports = EntityBlock;