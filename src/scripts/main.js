
var mqtt = require("mows");

mqtt.createClientBase = mqtt.createClient;
mqtt.createClient = function(opts) {
  return this.createClientBase("ws://localhost:3000", opts);
};

function buildUpdater(key) {
  return function(value) {
    var elem = document.querySelector(key)
    value = parseFloat(value) * 100
    elem.innerText = Math.round(value) / 100
  }
}

var updateHumidity = buildUpdater('#humidity')
var updateIrObject = buildUpdater('#ir-object')
var updateIrAmbient = buildUpdater('#ir-ambient')

bespoke.plugins.mqtt = function(deck) {
  var slider = mqtt.createClient();
  slider.subscribe('deck/next')
  slider.subscribe('deck/prev')
  slider.subscribe('sensortag/humidity')
  slider.subscribe('sensortag/ir/+')

  slider.on('message', function(topic, payload) {
    var command = topic.replace('deck/', '')
    if (deck[command])
      return deck[command]()

    if (topic == 'sensortag/humidity') {
      updateHumidity(payload)
    }

    if (topic == 'sensortag/ir/object') {
      updateIrObject(payload)
    }

    if (topic == 'sensortag/ir/ambient') {
      updateIrAmbient(payload)
    }

  });
};

bespoke.from('article', {
  mqtt: true,
  keys: true,
  touch: true,
  run: true,
  bullets: 'li, .bullet',
  scale: true,
  hash: true,
  progress: true,
  state: true
});
