
var mqtt = require("mows");

mqtt.createClientBase = mqtt.createClient;
mqtt.createClient = function(opts) {
  return this.createClientBase("ws://test.mosca.io", opts);
};

bespoke.plugins.mqtt = function(deck) {
  var client = mqtt.createClient();

  client.on('message', function(topic, payload) {
    var command = topic.replace('deck/', '')
    if (deck[command])
      return deck[command]()
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
