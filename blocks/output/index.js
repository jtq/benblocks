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

/**** Define general "Output" block class, containing common connectivity setup/event-handling (to be moved into a separate module when possible) ****/
function OutputBlock(inputConnector, outputConnector) {

  Block.call(this, outputConnector);

  //this.inputConnector = inputConnector || new BlockConnector(Serial2, A2, A3, B4);

  this.output.on('connected', function() {
    this.setBusy(true);
  }.bind(this));

  this.output.on('objectReceived', function() {
    this.setBusy(false);
  }.bind(this));
}

OutputBlock.prototype = Object.create(Block.prototype);
OutputBlock.prototype.constructor = OutputBlock;

module.exports = OutputBlock;