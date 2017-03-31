import path from 'path'
import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cookie from 'react-cookie'
import bearerToken from 'express-bearer-token'

import React from 'react'
import ReactDOMServer from 'react-dom/server'

import routes from './src/routes'
import { renderHTMLString } from '@sketchpixy/rubix/lib/node/router'
import RubixAssetMiddleware from '@sketchpixy/rubix/lib/node/RubixAssetMiddleware'

const port = process.env.PORT || 8080
const app = express()

app.use(compression())
app.use(cookieParser())
app.use(express.static(path.join(process.cwd(), 'public')))
app.set('views', path.join(process.cwd(), 'views'))
app.set('view engine', 'pug')
/** app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Expires', '-1')
  res.header('Pragma', 'no-cache')
  next()
}) */

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

app.listen(port, () => {
  console.log(`Node.js app is running at http://localhost:${port}/`);
})
