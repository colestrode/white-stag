const express = require('express')
const bodyParser = require('body-parser')
const formParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()

module.exports.makeApp = (config) => {
  const app = express()

  // return app by default, if port specified, start server
  // will ultimately be configurable
  app.post(config.routes.event, jsonParser, handleEventApi(config.eventProcessor))
  app.post(config.routes.outgoingWebhook, jsonParser, handleOutgoingWebhook(config.eventProcessor))
  app.post(config.routes.slashCommand, formParser, handleSlashCommand(config.eventProcessor))
  app.post(config.routes.interactiveMessage, formParser, handleInteractiveMessage(config.eventProcessor))

  if (config.port) {
    app.listen(config.port, () => {
      logger.info(`server listening on port ${config.port}`)
    })
  }

  return app
}

function handleEventApi(eventProcessor) {
  return (req, res) => {
    logger.info(`received event payload`)
    res.status(200).send()

    if (req.body.type !== 'event_callback') {
      return
    }

    const event = req.body.event

    eventProcessor.trigger(event.type, event, req.body)
 }
}

function handleOutgoingWebhook(eventProcessor) {
  return (req, res) => {
    logger.info(`received outgoing webhook`)
    res.status(200).send()
  }
}

function handleSlashCommand(eventProcessor) {
  return (req, res) => {
    logger.info(`received slash command`)
    res.status(200).send()
  }
}

function handleInteractiveMessage(eventProcessor) {
  return (req, res) => {
    logger.info(`received interactive message`)
    res.status(200).send()
  }
}
