
var mqtt = require("mows");

mqtt.createClientBase = mqtt.createClient;
mqtt.createClient = function(opts) {
  return this.createClientBase("ws://localhost:3000", opts);
};

(function() {
});

bespoke.plugins.mqtt = function(deck) {
  var slider = mqtt.createClient();
  slider.subscribe('deck/next')
  slider.subscribe('deck/prev')

  slider.on('message', function(topic) {
    var command = topic.replace('deck/', '')
    console.log('received', command);
    if (deck[command])
      deck[command]()
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
