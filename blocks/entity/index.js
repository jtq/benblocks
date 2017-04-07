var Block = require("http://127.0.0.1/benblocks/blocks/index.js");

/****
 * Hardware spec:
 *  Pins:
 *    Gnd: Gnd on other Pico
 *    3.3v: B3 on other Pico
 *    B3: 3.3v on other Pico
 *    B6: B7 on other Pico
 *    B7: B6 on other Pico
 */

function EntityBlock(data, outputConnector) {

  Block.call(this, outputConnector);

  this.data = data;

  this.output.on('connect', function() {
    //console.log('EntityBlock: sending data');
    this.setBusy(true);

    this.output.sendObject(this.data);

    this.setBusy(false);
    //console.log('EntityBlock: data sent');
  }.bind(this));
}

EntityBlock.prototype = Object.create(Block.prototype);
EntityBlock.prototype.constructor = EntityBlock;

module.exports = EntityBlock;