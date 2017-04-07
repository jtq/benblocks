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
function ScreenBlock(inputSerial, outputSerial) {

  OutputBlock.call(this, inputSerial, outputSerial);

  this.dimensions = { // LCD dimensions
    width: 84,
    height: 48
  };

  this.screenReady = null;  // Screen-initialised Promise

  /**** Set up screen ****/

  this.screenReady = new Promise(function(resolve, reject) {   // screen
    A5.write(0); // GND
    A6.write(1); // Backlight
    A7.write(1); // VCC

    // Setup SPI
    var spi = new SPI();
    spi.setup({ sck:B1, mosi:B10 });

    // Init LCD
    var g = require("PCD8544").connect(spi,B13,B14,B15, function() {
      ////console.log('Screen ready');
      g.clear();
      g.flip();
      resolve(g);
    });
  }.bind(this));

  this.output.on('objectReceived', this.objectReceived.bind(this));
  this.output.on('disconnect', this.clearScreen.bind(this));
}

ScreenBlock.prototype = Object.create(OutputBlock.prototype);
ScreenBlock.prototype.constructor = ScreenBlock;

ScreenBlock.prototype.objectReceived = function(obj) {

  //console.log('ScreenBlock: displaying graphic');

  this.screenReady.then(function(g) {
    g.clear();

    obj.imageValue.buffer = E.toArrayBuffer(atob(obj.imageValue.buffer));

    var xOffset = Math.floor((this.dimensions.width - obj.imageValue.width) / 2);
    var yOffset = Math.floor((this.dimensions.height - obj.imageValue.height) / 2);

    //g.drawRect(0, 0, this.dimensions.width-1, this.dimensions.height-1);  // Draw border (useful for debugging)
    g.drawImage(obj.imageValue, xOffset, yOffset);  // Draw raw image
    //this.drawImages(obj.imageValue, obj.integerValue, g); // Draw resized image
    g.flip(); // send the graphics to the display

  }.bind(this));
};

ScreenBlock.prototype.clearScreen = function(e) {  // On loss of connection, clear screen

  this.screenReady.then(function(g) {
    g.clear();
    g.flip();
  });
};

ScreenBlock.prototype.drawImages = function(image, numImages, g) {
  var sqrt = Math.sqrt(numImages);
  var images = {
    across: Math.ceil(sqrt),
    down: Math.round(sqrt)
  };

  var eachImage = {
    width: Math.floor(this.dimensions.width / images.across),
    height: Math.floor(this.dimensions.height / images.down)
  };

  //dumpBuffer(image.buffer, image.width, image.height);

  var resizedImage = this.resizeImage(image, eachImage);

  //dumpBuffer(resizedImage.buffer, resizedImage.width, resizedImage.height);

  var imagesDrawn = 0;

//  //console.log(eachImage);
//  //console.log(resizedImage.width, resizedImage.height);

  var xOffset = Math.round((eachImage.width-resizedImage.width)/2);
  var yOffset = Math.round((eachImage.height-resizedImage.height)/2);

  for(var j=0; j<images.down && imagesDrawn < numImages; j++) {
    for(var i=0; i<images.across && imagesDrawn < numImages; i++) {
      g.drawImage(
        resizedImage,
        (i*eachImage.width)+xOffset,
        (j*eachImage.height)+yOffset
      );
      imagesDrawn++;
    }
  }
};

ScreenBlock.prototype.resizeImage = function(image, container) {
  var originalBits = unpackBufferIntoBitmap(image.buffer, image.width, image.height);
  var conversionFactor = Math.min(container.width/image.width, container.height/image.height);

  ////console.log(image);
  ////console.log(container);
  ////console.log(conversionFactor);

  var newWidth = Math.round(image.width * conversionFactor);
  var newHeight = Math.round(image.height * conversionFactor);
  var newBits = new Uint8Array(newWidth*newHeight);
  newBits.fill(0);

  var newImage = {
    width: newWidth,
    height: newHeight,
    bpp: image.bpp,
    transparent: image.transparent,
    buffer: null
  };

  var convertedY, convertedX;

  for(var y=0; y<image.height; y++) {
    convertedY = Math.round(y * conversionFactor);
    for(var x=0; x<image.width; x++) {
      convertedX = Math.round(x * conversionFactor);
      var origIndex = (image.width*y)+x;
      var newIndex = (newWidth*convertedY)+convertedX;

      newBits[newIndex] = newBits[newIndex] | originalBits[origIndex];
    }
  }

  //dumpBitmap(newBits, newWidth, newHeight);

  ////console.log('Done: ', newBits.length, ' @ ', newWidth, 'x', newHeight);

  newImage.buffer = packBitmapIntoBuffer(newBits);

  return newImage;
};

function unpackBufferIntoBitmap(arrayBuffer, width, height) {
  var array = new Uint8Array(arrayBuffer);
  var bits = new Uint8Array(width*height);
  var newByte, b;
  for(var i=0; i<array.length; i++) {
    b = array[i];
    newByte = [
      0 + !!(b&128),  // most significant byte
      0 + !!(b&64),
      0 + !!(b&32),
      0 + !!(b&16),
      0 + !!(b&8),
      0 + !!(b&4),
      0 + !!(b&2),
      0 + !!(b&1)     // least significant bit
    ];
    bits.set(newByte, i*8);
  }

  return bits;
}

function packBitmapIntoBuffer(bitmap) {
  var packed = new Uint8Array(bitmap.length/8);
  var offset;
  for(var i=0; i<packed.length; i++) {
    offset = i*8;
    packed[i] =
      (bitmap[offset]     * 128) +
      (bitmap[offset+1]   * 64) +
      (bitmap[offset+2]   * 32) +
      (bitmap[offset+3]   * 16) +
      (bitmap[offset+4]   * 8) +
      (bitmap[offset+5]   * 4) +
      (bitmap[offset+6]   * 2) +
      (bitmap[offset+7]   * 1);
  }

  return packed.buffer;
}

function dumpBitmap(bitmap, width, height) {
  for(var i=0; i<height; i++) {
    //console.log(bitmap.slice(width*i, width*(i+1)));
  }
}

function dumpBuffer(imageBuffer, width, height) {
  var bits = unpackBufferIntoBitmap(imageBuffer, width, height);

  dumpBitmap(bits, width, height);
}


var block = null;
function init() {
  USB.setConsole();
  block = new ScreenBlock();
}

E.on('init', init);