'use strict'

let date = new Date()
date = date.setMinutes(date.getMinutes() + expiryInMinutes)
const ssl = process.env.SSL || false
const expiryInSeconds = process.env.jwtExpiryInSeconds || 60 // should equal expiryInMinutes
const expiryInMinutes = process.env.jwtExpiryInMinutes || 1 // should equal expiryInSeconds
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 8080

module.exports = {
  host: host,
  port: port,
  jwt: {
    secret: 'rH!y+sZcK-_a TTZyDWjPGAJ q-RF&6-GW',
    expiry: expiryInSeconds
  },
  cookies: {
    config: {
      domain: host,
      expires: date,
      maxAge: expiryInSeconds,
      path: '/',
      secure: false
    }
  }
}
