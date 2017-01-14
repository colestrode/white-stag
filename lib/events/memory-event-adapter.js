const logger = require('../logger')

function thing() {
  let config = {
    trigger: () => {}
  }

  return {
    bootstrap: bootstrap,
    on
  }

  function bootstrap(cfg) {
    config = cfg
  }

  function on(event, cb) {

  }
}

module.exports.bootstrap = emitter.emit.bind(emitter)
module.exports.on = emitter.on.bind(emitter)
module.exports.off = emitter.removeListener.bind(emitter)
