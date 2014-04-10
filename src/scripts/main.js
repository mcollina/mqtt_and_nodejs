
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
var updateSlider = buildUpdater('#slider')

bespoke.plugins.mqtt = function(deck) {
  var client = mqtt.createClient();
  client.subscribe('deck/next')
  client.subscribe('deck/prev')
  client.subscribe('sensortag/humidity')
  client.subscribe('sensortag/ir/+')
  client.subscribe('groove/slider')

  client.on('message', function(topic, payload) {
    var command = topic.replace('deck/', '')
    if (deck[command])
      return deck[command]()

    if (topic == 'sensortag/humidity') {
      updateHumidity(payload)
    }

    if (topic == 'sensortag/ir/object') {
      updateIrObject(payload)
    }

    if (topic == 'groove/slider') {
      updateSlider(JSON.parse(payload).value)
    }

  });


  ;(function () {
    var elem = document.querySelector('#ledbar')
    elem.onchange = function() {
      var value = parseInt(elem.value)
      var payload = JSON.stringify({
        value: value
      })
      client.publish('groove/ledbar', payload)
    }
  })()

  function wireLed(htmlId, num, red, green, blue) {
    var elem = document.querySelector(htmlId)
    elem.onclick = function() {
      var payload = JSON.stringify({
        r: red,
        g: green,
        b: blue
      })
      client.publish('groove/led/' + num, payload)
    }
  }

  wireLed('#led-red', 1, 255, 0, 0)
  wireLed('#led-green', 2, 0, 255, 0)
  wireLed('#led-blue', 3, 0, 0, 255)

  ;(function () {
    var elem = document.querySelector('#led-disable')
    elem.onclick = function() {
      var payload = JSON.stringify({
        r: 0,
        g: 0,
        b: 0
      })
      client.publish('groove/led/1', payload)
      client.publish('groove/led/2', payload)
      client.publish('groove/led/3', payload)
    }
  })()
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


(function() {
  var form = document.querySelector('form.disabled')
  form.onsubmit = function() { return false }
})()
