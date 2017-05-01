import path from 'path'
import mime from 'mime'
import fs from 'fs'
import http from 'http'
import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cookie from 'react-cookie'
import bearerToken from 'express-bearer-token'

import config from './src/common/config'

import React from 'react'
import ReactDOMServer from 'react-dom/server'

import mongoose from 'mongoose'
import RefreshToken from './refreshTokenModel'

import routes from './src/routes'
import { renderHTMLString } from '@sketchpixy/rubix/lib/node/router'
import RubixAssetMiddleware from '@sketchpixy/rubix/lib/node/RubixAssetMiddleware'

const twoFactor = require('passport-2fa-totp')
const assert = require('assert')

const port = process.env.PORT || 8080
const app = express()
const db = require('./db')
const ObjectID = require('mongodb').ObjectID

db.connect(config.mongoUrl, function(err, result) {
  if (err !== null) {
    console.log('Cannot connect to MongoDB')
    console.log(err)
  }
})

mongoose.connect(config.mongoUrl, function(err, result) {
  if (err) return res.status(500).send(`ERROR connecting to: ${config.mongoUrl}; ${err}`).end()
})

app.use(compression({
  level: 9,
  memLevel: 9
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(process.cwd(), 'public')))
app.set('views', path.join(process.cwd(), 'views'))
app.set('view engine', 'pug')

app.post('/user/logout', function(req, res, next) {
  const deleteRefreshToken = function(db, cb) {
    const refreshTokensCollection = db.get().collection('refreshTokens')
    refreshTokensCollection.deleteOne({
      token : req.body.refreshToken
    }, (err, result) => {
      assert.equal(err, null)
      assert.equal(1, result.result.n)
      cb(result)
    })
  }
  deleteRefreshToken(db, function(response) {
    return res.json({
      message: response
    }).end()
  })
})

app.post('/totp/codes', function(req, res, next) {
  const users = db.get().collection('users')
  users.findOne({ email: req.body.email }, function(err, user) {
    if (err) return res.json({
      err: err
    }).end()

    if ( ! user) return res.json({
      err: err
    }).end()

    return res.json({
      totps: user.backup_totp
    }).end()

    /**users.update(user, { $set: { secret: req.session.qr } }, function (err) {
      if (err) {
        // req.flash('setup-2fa-error', err);
        return res.redirect('/setup-2fa')
      }

      res.redirect('/profile')
    })*/
  })
})

function renderHTML(req, res) {
  /**
   * Required to render cookies on the server
   */
  const unPlug = cookie.plugToRequest(req, res);

  renderHTMLString(routes, req, (error, redirectLocation, html) => {
    if (error) {
      if (error.message === 'Not found') {
        res.status(404).send(error.message)
      } else {
        res.status(500).send(error.message)
      }
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else {
      res.render('index', {
        content: html
      })
    }
  })
}

app.get('/token/refresh', (req, res, next) => {
  RefreshToken.findOne({}, function(err, token) {
    if (err) return res.status(500).send(err).end()
    else return res.status(200).json(token).end()
  })
})

/** BEGIN X-EDITABLE ROUTES */

app.get('/xeditable/groups', (req, res) => {
  res.send([
    {value: 0, text: 'Guest'},
    {value: 1, text: 'Service'},
    {value: 2, text: 'Customer'},
    {value: 3, text: 'Operator'},
    {value: 4, text: 'Support'},
    {value: 5, text: 'Admin'}
  ])
})

app.get('/xeditable/status', (req, res) => {
  res.status(500).end()
})

app.post('/xeditable/address', (req, res) => {
  res.status(200).end()
})

app.post('/dropzone/file-upload', (req, res) => {
  res.status(200).end()
})

/** END X-EDITABLE ROUTES */

/**
 * Generate QR Code for Totp
 */
/** app.get('/qrcode', (req, res) => {
  res.status(200).end()
}) */

app.post('/dropzone/file-upload', (req, res) => {
  res.status(200).end()
})

app.get('/', RubixAssetMiddleware('ltr'), (req, res, next) => {
  renderHTML(req, res)
})

app.get('/ltr/*', RubixAssetMiddleware('ltr'), (req, res, next) => {
  renderHTML(req, res)
})

app.get('/rtl/*', RubixAssetMiddleware('rtl'), (req, res, next) => {
  renderHTML(req, res)
})

app.get('/2fa', (req, res, next) => {
  const newSecret = twoFactor.generateSecret({name: 'My Awesome App', account: 'johndoe'})
  res.send(newSecret).end()
})

app.listen(port, () => {
  console.log(`Node.js app is running at http://localhost:${port}/`)
})
