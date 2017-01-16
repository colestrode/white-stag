const stag = require('./index')
const config = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  port: process.env.PORT,
  oauth: {
    scope: ['channels:write']
  }
};
const controller = stag(config)

controller.on('message.channels', () => {
  console.log('heard an event!');
})