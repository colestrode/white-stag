const _ = lodash
const eventProcessor = require('./events/event-processor')
const defaults = {
  routes: {
    event: '/event',
    outgoingWebhook: '/outgoing-webhook',
    slashCommand: '/slash-command',
    interactiveMessage: 'interactive-message',
  },
  eventAdapter: require('./events/memory-event-adapter')
}

module.exports.normalize = (cfg) => {
  const config = _.cloneDeep(cfg)
  _.defaultsDeep(config, defaults)

  config.eventProcessor = eventProcessor(config)

  return config
}
