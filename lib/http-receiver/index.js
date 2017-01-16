const express = require('express')
const bodyParser = require('body-parser')
const formParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()
const logger = require('../logger')
const oauth = require('./oauth')
const incomingApis = require('./incoming-apis')

module.exports.makeApp = (config) => {
  const app = express()

  app.use(config.routes.oauthAuthorize, oauth.handleOauthAuthorize(config))
  app.use(config.routes.oauthReceive, oauth.handleOauthReceive(config))

  app.post(config.routes.event, jsonParser, incomingApis.handleEventApi(config.eventProcessor))
  app.post(config.routes.outgoingWebhook, jsonParser, incomingApis.handleOutgoingWebhook(config.eventProcessor))
  app.post(config.routes.slashCommand, formParser, incomingApis.handleSlashCommand(config.eventProcessor))
  app.post(config.routes.interactiveMessage, formParser, incomingApis.handleInteractiveMessage(config.eventProcessor))

  if (config.port) {
    app.listen(config.port, () => {
      logger.info(`server listening on port ${config.port}`)
    })
  }

  return app
}
