
if (!process.env.DEBUG)
  process.env.DEBUG = 'blue'

var debug = require('debug')('blue')
  , SensorTag = require('sensortag')
  , press = require('mac-key-press')
  , leftKey = 123
  , rightKey = 124
  , client = require('mqtt').createClient()

debug('searching for a sensor tag')

SensorTag.discover(function(sensorTag) {
  debug('discovered', sensorTag.uuid)

  sensorTag.connect(function() {
    debug('connected')
    sensorTag.discoverServicesAndCharacteristics(function() {
      debug('discovered all characteristics')
      sensorTag.notifySimpleKey(function() {
        debug('key press correctly setted up')
      })

      sensorTag.enableHumidity(function() {
        sensorTag.notifyHumidity(function() {
          debug('humidity correctly setted up')
        })
      })

      sensorTag.enableIrTemperature(function() {
        sensorTag.notifyIrTemperature(function() {
          debug('ir temperature correctly setted up')
        })
      })
    })
  })

  sensorTag.on('simpleKeyChange', function(left, right) {
    if (left) {
      debug('left pressed')
      //press(leftKey)
      client.publish('deck/prev');
    } else if (right) {
      debug('right pressed')
      client.publish('deck/next');
      //press(rightKey)
      press(36) // return
    }
  })

  sensorTag.on('humidityChange', function(temperature, humidity) {
    client.publish('sensortag/temperature', '' + temperature)
    client.publish('sensortag/humidity', '' + humidity)
  })

  sensorTag.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
    client.publish('sensortag/ir/object', '' + objectTemperature)
    client.publish('sensortag/ir/ambient', '' + ambientTemperature)
  })
})
