const logger = require('skellington-logger')('white-stag')
const controllerFactory = require('./lib/controller')
const httpReceiver = require('./lib/http-receiver')
const configLib = require('./lib/config')


module.exports = function initialize(cfg) {
  const config = configLib.normalize(cfg)
  const controller = controllerFactory.create(config)
  controller.server = httpReceiver.makeApp(config)

  return controller
}

