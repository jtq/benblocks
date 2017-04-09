var Block = require("http://127.0.0.1/benblocks/blocks/index.js");

function EntityBlock(data, outputConnector) {

  Block.call(this, outputConnector);

  this.data = data;

  this.output.on('connect', function() {
    this.setBusy(true);
    this.output.sendObject(this.data);
    this.setBusy(false);
  }.bind(this));
}

EntityBlock.prototype = Object.create(Block.prototype);
EntityBlock.prototype.constructor = EntityBlock;

module.exports = EntityBlock;