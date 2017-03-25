/****
 * Hardware spec:
 *  Hardware:
 *    1 x Analougue speaker
 *  Pins:
 *    A5: Input on speaker

 *    Gnd: Gnd on other Pico and speaker
 *    3.3v: B3 on other Pico
 *    B3: 3.3v on other Pico
 *    B6: B7 on other Pico
 *    B7: B6 on other Pico
 */

var OutputBlock = require("http://127.0.0.1/benblocks/blocks/output/index.js");

/**** Define specific "Screen" block class that descends from OutputBlock ****/
function SoundBlock(speakerPin, inputSerialPort) {
  OutputBlock.call(this, inputSerialPort);
  this.speaker = speakerPin;
}

SoundBlock.prototype = Object.create(OutputBlock.prototype);
SoundBlock.prototype.constructor = SoundBlock;

SoundBlock.prototype.setUp = function() {
  OutputBlock.prototype.setUp.call(this);
};

SoundBlock.prototype.processBuffer = function(buffer) {
  var obj = null;
  try {
    obj = JSON.parse(buffer);
    obj.soundValue.buffer = atob(obj.soundValue.buffer);
  }
  catch(e) {
    console.log("Error parsing buffer\Buffer: -->", buffer, "<--\nJSON: -->", obj, "<--");
  }

  var sound = obj.soundValue;

  var wave = new Waveform(sound.buffer.length, { bits:8 });
  wave.buffer.set(sound.buffer);

  analogWrite(this.speaker, 0.5, {freq:20000}); 
  wave.startOutput(this.speaker, sound.samples);

};

SoundBlock.prototype.onDisconnect = function(e) {  // On loss of connection, stop sound
  digitalWrite(this.speaker, 0);
};


var block = new SoundBlock(A5, Serial1);

E.on('init', block.setUp.bind(block));