const EventEmitter = new require('events').EventEmitter
const logger = require('skellington-logger')('white-stag')


module.exports = (config) => {
  const emitter = new EventEmitter()
  emitter.setMaxListeners(Infinity)
  emitter.on('error', eventEmitterError)


  config.eventAdapter.bootstrap({
    trigger: trigger
  })

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
    // should call the bot factory

    emitter.emit(event, ...data)
  }
}

function eventEmitterError(e) {
  logger.error('an unhandled EventEmitter error occurred', e)
}