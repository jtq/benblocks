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


// No block data

var screenReady = null;

function setReceiving(receiving) {
  if(receiving) {
    digitalWrite(LED1, 1);  // Red = receiving
    digitalWrite(LED2, 0);  // Green = listening
  }
  else {
    digitalWrite(LED1, 0);  // Red = receiving
    digitalWrite(LED2, 1);  // Green = listening
  }
}

function setUp() {

  USB.setConsole();

  // LCD dimensions
  var screen = {
    width: 84,
    height: 48
  };

  /**** Set up inputs ****/
  pinMode(B3, 'input_pulldown');  // Listen for connection from earlier block

  Serial1.setup(9600, { tx:B6, rx:B7 });  // Data connection
  setReceiving(false);

  var buffer = '';
  Serial1.on('data', function (data) {

    setReceiving(true);

    //console.log("Received", typeof data, data);

    buffer += data;

    if(data.indexOf('\u0004') !== -1) { // ctrl+D - End of Transmission character
      screenReady.then(function(g) {
        g.clear();

        var obj = null;
        try {
          obj = JSON.parse(buffer);
          obj.imageValue.buffer = E.toArrayBuffer(atob(obj.imageValue.buffer));
        }
        catch(e) {
          console.error("Error parsing JSON: -->", obj, "<--");
        }

        var xOffset = Math.floor((screen.width - obj.imageValue.width) / 2);
        var yOffset = Math.floor((screen.height - obj.imageValue.height) / 2);
        g.drawImage(obj.imageValue, xOffset, yOffset);
        // send the graphics to the display
        g.flip();

        buffer = '';  // And reset buffer
      });

      setReceiving(false);
    }

  });

  setWatch(function(e) {  // On loss of connection, clear screen

    //console.log('Disconnect');

    screenReady.then(function(g) {
      g.clear();
      g.flip();
    });

  }, B3, { repeat: true, edge: 'falling', debounce:500 });  


  /**** Set up outputs ****/

  screenReady = new Promise(function(resolve, reject) {   // screen
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
}

E.on('init', setUp);