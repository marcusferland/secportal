'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OAuthRefreshTokenSchema = new Schema({
  refreshToken: String,
  clientId: String,
  userId: String,
  expires: Date
}, { collection: 'OAuthRefreshToken' })

module.exports = mongoose.model('OAuthRefreshToken', OAuthRefreshTokenSchema)
