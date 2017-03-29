const qr = require('qrcode')
const speakeasy = require('speakeasy')
const app = require('express')()
const cors = require('cors')
const port = 3000

app.use(cors())
app.get('/', (req, res) => {
  const secret = speakeasy.generateSecret({
    length: 20
  })
  const token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32'
  })
  qr.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) res.json(500, {
      error: 'Request failed; could not generate base64 URL'
    }).end()
    else res.status(200).json({
      url: data_url,
      token: token
    }).end()
  })
})
app.listen(port, () => {
  console.log(`QR Code generator app is running at http://localhost:${port}/`);
})
