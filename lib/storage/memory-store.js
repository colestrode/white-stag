const logger = require('../logger')

module.exports = function() {
  const oauthStore = new Map()

  logger.info('using memory store, data will be lost on restart')

  return {
    oauth: {
      get: (teamId, cb) => {
        cb(null, oauthStore.get(teamId))
      },
      set: (teamId, data, cb) => {
        oauthStore.set(teamId, data)
        cb(null)
      },
      delete: (teamId, cb) => {
        oauthStore.delete(teamId)
        cb(null)
      }
    }
  }
}