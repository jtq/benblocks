var Block = require("http://127.0.0.1/benblocks/blocks/index.js");
var BlockConnector = require('http://127.0.0.1/benblocks/blocks/block-connector.js');

/**** Define general "Output" block class, containing common connectivity setup/event-handling (to be moved into a separate module when possible) ****/
function OutputBlock(inputConnector, outputConnector) {

  Block.call(this, outputConnector);

  this.input = inputConnector || new BlockConnector(Serial2, A2, A3, B5);

  this.input.on('connect', function() {
    this.setBusy(true);
  }.bind(this));

  this.input.on('objectReceived', function(obj) {
    this.data = obj;
    this.output.sendObject(this.data);
    this.setBusy(false);
  }.bind(this));
}

OutputBlock.prototype = Object.create(Block.prototype);
OutputBlock.prototype.constructor = OutputBlock;

module.exports = OutputBlock;