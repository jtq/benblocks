/****
 * Hardware spec:
 *  Hardware:
 *    1 x Analogue speaker
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
function SoundBlock(speakerPin, inputConnector, outputConnector) {

  OutputBlock.call(this, inputConnector, outputConnector);

  this.speaker = speakerPin;

  this.speakerOff();

  this.output.on('objectReceived', this.objectReceived.bind(this));
  this.output.on('disconnect', this.speakerOff.bind(this));
}

SoundBlock.prototype = Object.create(OutputBlock.prototype);
SoundBlock.prototype.constructor = SoundBlock;

SoundBlock.prototype.objectReceived = function(obj) {

  console.log('SoundBlock: playing sound');

  obj.soundValue.buffer = E.toArrayBuffer(atob(obj.soundValue.buffer));
  var sound = obj.soundValue;

  this.wave = new Waveform(sound.buffer.length, { bits:8 });
  this.wave.buffer.set(sound.buffer);

  analogWrite(this.speaker, 0.5, {freq:20000}); 
  this.wave.startOutput(this.speaker, sound.samples, {repeat:true});

  var soundDuration = (sound.buffer.length / sound.samples) * 1000 * obj.integerValue;

  setTimeout(this.speakerOff.bind(this), soundDuration);  // Explicitly turn speaker off after sound finishes, to avoid audible analogue noise on pin
};

SoundBlock.prototype.speakerOff = function() {
  if(this.wave) {
    this.wave.stop();
  }
  this.wave = null;
  digitalWrite(this.speaker, 0);
};

var block = null;

function init() {
  block = new SoundBlock(A5);
}

E.on('init', init);
