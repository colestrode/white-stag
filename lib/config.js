const _ = lodash
const eventProcessor = require('./events/event-processor')
const defaults = {
  routes: {
    event: '/event',
    outgoingWebhook: '/outgoing-webhook',
    slashCommand: '/slash-command',
    interactiveMessage: 'interactive-message',
  },
  oauth: {
    scope: []
  },
  eventAdapter: require('./events/memory-event-adapter')
}

module.exports.normalize = (cfg) => {
  const config = _.cloneDeep(cfg)
  _.defaultsDeep(config, defaults)

  // TODO test for client ID and scope


  config.eventProcessor = eventProcessor(config)

  if (!config.storage) {
    config.storage = require('./storage/memory-store')()
  }

  return config
}
