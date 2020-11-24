/* 
  Gets a session token from session. If not found, generates a token and then stores it in session
  for 3 minutes and returns it. If the token is expired, generates it again and returns it.
*/
const { v1: uuidv1 } = require('uuid')
const isExpired = require('./isExpired')

function generateSession() {
  const MS_PER_MINUTE = 60000
  const expires = new Date()
  expires.setTime(expires.getTime() + 3 * MS_PER_MINUTE)
  return {
    token: uuidv1(),
    expires
  }
}

module.exports = (ctx, config) => {
  const { googleMapsSession } = ctx.session
  if(!googleMapsSession) {
    const newSession = generateSession()
    ctx.session.googleMapsSession = newSession
    return newSession.token
  } else {
    const { expires, token } = googleMapsSession
    if(isExpired(expires)) {
      const newSession = generateSession()
      ctx.session.googleMapsSession = newSession
      return newSession.token
    } else {
      if(config && config.new === true) {
        const newSession = generateSession()
        ctx.session.googleMapsSession = newSession
      }
      return token
    }
  }
}