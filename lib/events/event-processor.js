module.exports = (config) => {
  const adapter = config.eventAdapter

  return {
    off: off,
    on: on,
    trigger: trigger
  }

  function off(event, cb) {
    adapter.off(event, cb)
  }

  function on(event, cb) {
    adapter.on(event, cb)
  }

  function trigger(event, ...data) {
    adapter.trigger(event, ...data)
  }
}
