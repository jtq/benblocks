/****
 * Hardware spec:
 *  Hardware:
 *    1 x PCD8544 LCD driver (Nokia 5110)
 *  Pins:
 *    B15: RST on LCD
 *    B14: CS on LCD
 *    B13: DC on LCD
 *    B10: DIN on LCD
 *    B1: CLK on LCD
 *    A7: VCC on LCD
 *    A6: LED on LCD
 *    A5: GND on LCD

 *    Gnd: Gnd on other Pico
 *    3.3v: B3 on other Pico
 *    B3: 3.3v on other Pico
 *    B6: B7 on other Pico
 *    B7: B6 on other Pico
 */

var OutputBlock = require("http://127.0.0.1/benblocks/blocks/output/index.js");

/**** Define specific "Screen" block class that descends from OutputBlock ****/
function ScreenBlock(inputSerialPort) {
  OutputBlock.call(this, inputSerialPort);

  this.dimensions = { // LCD dimensions
    width: 84,
    height: 48
  };

  this.screenReady = null;  // Screen-initialised Promise
}

ScreenBlock.prototype = Object.create(OutputBlock.prototype);
ScreenBlock.prototype.constructor = ScreenBlock;

ScreenBlock.prototype.setUp = function() {

  OutputBlock.prototype.setUp.call(this);

  /**** Set up screen ****/

  this.screenReady = new Promise(function(resolve, reject) {   // screen
    A5.write(0); // GND
    A7.write(1); // VCC

    // Setup SPI
    var spi = new SPI();
    spi.setup({ sck:B1, mosi:B10 });

    // Init LCD
    var g = require("PCD8544").connect(spi,B13,B14,B15, function() {
      //console.log('Screen ready');
      g.clear();
      g.flip();
      resolve(g);
    });
  });
};

ScreenBlock.prototype.processBuffer = function(buffer) {
  this.screenReady.then(function(g) {
    g.clear();

    var obj = null;
    try {
      obj = JSON.parse(buffer);
      obj.imageValue.buffer = E.toArrayBuffer(atob(obj.imageValue.buffer));
    }
    catch(e) {
      console.log("Error parsing buffer\Buffer: -->", buffer, "<--\nJSON: -->", obj, "<--");
    }

    var xOffset = Math.floor((this.dimensions.width - obj.imageValue.width) / 2);
    var yOffset = Math.floor((this.dimensions.height - obj.imageValue.height) / 2);
    g.drawImage(obj.imageValue, xOffset, yOffset);
    // send the graphics to the display
    g.flip();
  }.bind(this));
};

ScreenBlock.prototype.onDisconnect = function(e) {  // On loss of connection, clear screen
  this.screenReady.then(function(g) {
    g.clear();
    g.flip();
  });
};


var block = new ScreenBlock(Serial1);

E.on('init', block.setUp.bind(block));