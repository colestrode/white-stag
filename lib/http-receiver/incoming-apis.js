const logger = require('../logger')

module.exports.handleEventApi = function(eventProcessor) {
  return (req, res) => {
    logger.info(`received event payload`)

    logger.info('body', req.body);

    if (req.body.type === 'url_verification') {
      // respond to challenge
      res.status(200).send({challenge: req.body.challenge})
      return
    }

    res.status(200).send()

    if (req.body.type !== 'event_callback') {
      return
    }
    // not sure what this is... ignore it
    const event = req.body.event

    eventProcessor.trigger(event.type, event, req.body)
  }
}

module.exports.handleOutgoingWebhook = function(eventProcessor) {
  return (req, res) => {
    logger.info(`received outgoing webhook`)
    res.status(200).send()
  }
}

module.exports.handleSlashCommand = function(eventProcessor) {
  return (req, res) => {
    logger.info(`received slash command`)
    res.status(200).send()
  }
}

module.exports.handleInteractiveMessage = function(eventProcessor) {
  return (req, res) => {
    logger.info(`received interactive message`)
    res.status(200).send()
  }
}
