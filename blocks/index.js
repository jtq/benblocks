var BlockConnector = require('http://127.0.0.1/benblocks/blocks/block-connector.js');
var EventSource = require('https://github.com/jtq/event-source/blob/master/index.js');

/****
 * Hardware spec:
 *  Pins:
 *    Gnd: Gnd on other Pico
 *    3.3v: B3 on other Pico
 *    B3: 3.3v on other Pico
 *    B6: B7 on other Pico
 *    B7: B6 on other Pico
 */

function Block(outputConnector) {
  USB.setConsole();

  EventSource.call(this); // Give this object event-handling capabilities

  this.data = null; // Data object (persistent in EntityBlocks, received and retransmitted from adjoining EntityBlock for OutputBlocks)
  this.output = outputConnector || new BlockConnector(Serial1, B6, B7, B3);

  this.output.on('disconnect', this.onDisconnect.bind(this));

  this.setBusy(false);                 // Display indicator
}

Block.prototype.setBusy = function(busy) {
  digitalWrite(LED1, 0+busy);  // Red = busy
  digitalWrite(LED2, 0+(!busy));  // Green = waiting
};

Block.prototype.onDisconnect = function(e) {  // On loss of connection
  this.setBusy(false);
};

module.exports = Block;