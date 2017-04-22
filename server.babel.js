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

const port = process.env.PORT || 8080
const app = express()

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
