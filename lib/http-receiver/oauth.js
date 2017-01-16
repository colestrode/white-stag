const qs = require('qs')
const _ = require('lodash')
const request = require('request')
const logger = require('../logger')

/**
 * Handles redirect from this app to Slack, initiating the Oauth flow
 * @param config
 * @returns {function(*, *)}
 */
module.exports.handleOauthAuthorize = function(config) {
  let oauthParams = _.pick(config.oauth, ['scope', 'redirect_uri', 'state', 'team'])
  oauthParams.client_id = config.clientId
  oauthParams.scope = oauthParams.scope.join(',')

  const redirectUrl = `https://slack.com/oauth/authorize?${qs.stringify(oauthParams)}`

  return (req, res) => {
    res.redirect(302, redirectUrl)
  }
}

/**
 * Handles Oauth redirect from Slack after user has authorized this app
 * @param config
 * @returns {function(*, *)}
 */
module.exports.handleOauthReceive = function(config) {
  return (req, res) => {
    if (req.query.state && req.query.state !== config.oauth.state) {
      logger.error(`oauth access rejected: state does not match. expected ${config.oauth.state} but got ${req.query.state}`)
      return res.status(403).send({error: 'unauthorized'})
    }

    const accessParams = {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code: req.query.code
    }
    Object.assign(accessParams, _.pick(config.oauth, ['redirect_uri']))

    request({
      method: 'GET',
      uri: 'https://slack.com/api/oauth.access',
      qs: accessParams,
      json: true
    }, handleAccesResponse)

    function handleAccesResponse(err, accessResponse, body) {
      if (err || accessResponse.status >= 400 || !body.ok) {
        res.status(500).send({message: 'received a bad Oauth response from Slack', error: err || body})
        return logger.error(`oauth access rejected: there was an error requesting an oauth token`, err || body)
      }

      config.storage.oauth.set(body.team_id, body, saveCredentials)
    }

    function saveCredentials(err) {
      if (err) {
        res.status(500).send({error: 'error saving oauth credentials'})
        return logger.error(`There was an error persisting OAuth credentials, team ${body.team_id} will not be authorized`, err)
      }

      res.status(200).send({status: 'welcome!'})
    }
  }
}
