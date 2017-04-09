var BlockConnector = require('http://127.0.0.1/benblocks/blocks/block-connector.js');
var EventSource = require('http://127.0.0.1/event-source/index.js');

function Block(outputConnector) {

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