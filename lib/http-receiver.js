const qs = require('qs')
const _ = require('lodash')
const request = require('request')
const logger = require('./logger')
const express = require('express')
const bodyParser = require('body-parser')
const formParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()

module.exports.makeApp = (config) => {
  const app = express()

  // return app by default, if port specified, start server
  // will ultimately be configurable
  app.use(config.routes.oauthAuthorize, handleOauthAuthorize(config))
  app.use(config.routes.oauthAccess, handleOauthAccess(config))
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

/**
 * Handles redirect from this app to Slack, initiating the Oauth flow
 * @param config
 * @returns {function(*, *)}
 */
function handleOauthAuthorize(config) {
  const oauthParams = ['clientId', 'scope', 'redirect_uri', 'state', 'team']
  const redirectUrl = `https://slack.com/oauth/authorize?${qs.parse(_.pick(config.oauth, oauthParams))}`

  return (req, res) => {
    res.redirect(301, redirectUrl)
  }
}

/**
 * Handles Oauth redirect from Slack after user has authorized this app
 * @param config
 * @returns {function(*, *)}
 */
function handleOauthAccess(config) {
  return (req, res) => {
    if (req.query.state && req.query.state !== config.oauth.state) {
      logger.error(`oauth access rejected: state does not match. expected ${config.oauth.state} but got ${req.query.state}`)
      return res.status(403).send({error: 'unauthorized'})
    }

    res.status(200).send()

    const accessParams = _.pick(config.oauth, ['clientId', 'clientSecret', 'redirect_uri'])
    accessParams.code = req.query.code

    request({
      method: 'GET',
      uri: 'https://slack.com/api/oauth.access',
      qs: accessParams,
      json: true
    }, handleAccesResponse)
  }

  function handleAccesResponse(err, res, body) {
    if (err || res.status >= 400) {
      return logger.error(`oauth access rejected: there was an error requesting an oauth token`, err || body)
    }

    config.storage.oauth.set(body, function(err) {
      if (err) {
        return logger.error(`There was an error persisting OAuth credentials, team ${body.team_id} will not be authorized`, err)
      }
    })
  }
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
