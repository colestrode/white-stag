const logger = require('./logger')


/**
 * A controller is the public API for event management
 * @param config
 */
module.exports.create = (config) => {
  const controller = {}

  controller.on = (event, handler) => {
    return config.eventProcessor.on(event, function(bot, message) {
      try {
        handler(bot, message)
      } catch(e) {
        logger.error('a handler for ${event} threw an error', e)
      }
    })
  }

  controller.off = (event, handler) => {
    config.eventProcessor.off(event, handler)
  }

  controller.hears = (rgx, hearTypes, handler) => {
    // TODO need different types for events api
    config.eventProcessor.on('message', (bot, message) => {
      // test for message text, message type
      // hearTypes: direct_message, direct_mention, mention, ambient
      // matched in that order


    })
  }

  controller.topic = (topicName, cb) => {
    // TODO need a convo store
  }

  controller.slashCommand = (command, rgx, handler) => {
    return config.eventProcessor.on('slash_command', (bot, message) => {
      if (message.command === command && rgx.test(message.text)) {
        handler(bot, message)
      }
    })
  }

  controller.interactiveMessage = (callbackId, action, handler) => {
    return config.eventProcessor.on('interactive_message', (bot, message) => {
      const actions = message.actions.map((action) => action.name.toLowerCase())

      if (message.callback_id === callbackId && actions.includes(action.toLowerCase())) {
        handler(bot, message)
      }
    })
  }

  controller.outgoingWebhook = (rgx, handler) => {
    return config.eventProcessor.on('outgoing_webhook', (bot, message) => {
      if (rgx.test(message.text)) {
        handler(bot, message)
      }
    })
  }

  return controller
}

