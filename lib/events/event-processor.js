const EventEmitter = new require('events').EventEmitter
const logger = require('../logger')


module.exports = () => {
  const emitter = new EventEmitter()
  emitter.setMaxListeners(Infinity)
  emitter.on('error', eventEmitterError)

  return {
    off: off,
    on: on,
    trigger: trigger
  }

  function off(event, cb) {
    emitter.off(event, cb)
  }

  function on(event, cb) {
    emitter.on(event, cb)
  }

  function trigger(event, ...data) {
    // should call the app factory

    emitter.emit(event, ...data)
  }
}

function eventEmitterError(e) {
  logger.error('an unhandled EventEmitter error occurred', e)
}