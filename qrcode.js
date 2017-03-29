const qr = require('qrcode')
const speakeasy = require('speakeasy')
const app = require('express')()
const cors = require('cors')
const port = 3000

const secret = speakeasy.generateSecret({
  length: 20
})

app.use(cors())
app.get('/', (req, res) => {
  qr.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) res.json(500, {
      error: 'Request failed; could not generate base64 URL'
    })
    else res.status(200).send(data_url)
  })
})
app.listen(port, () => {
  console.log(`QR Code generator app is running at http://localhost:${port}/`);
})
