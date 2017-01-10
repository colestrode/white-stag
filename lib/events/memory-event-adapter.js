const logger = require('skellington-logger')('white-stag')
const EventEmitter = new require('events').EventEmitter
const emitter = new EventEmitter()


emitter.setMaxListeners(Infinity)
emitter.on('error', eventEmitterError)


module.exports.trigger = emitter.emit.bind(emitter)
module.exports.on = emitter.on.bind(emitter)
module.exports.off = emitter.removeListener.bind(emitter)

function eventEmitterError(e) {
  logger.error('an unhandled EventEmitter error occurred', e)
}