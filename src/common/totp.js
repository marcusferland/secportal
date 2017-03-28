import React from 'react'
import { withRouter } from 'react-router'
import speakeasy from 'speakEasy'
import QRCode from 'qrcode'

@withRouter
class Totp extends React.Component {

  constructor(props, context) {
    super(props)
  }

  componentDidMount() {
    const secret = speakeasy.generateSecret({ length: 20 })
    console.log(secret.base32); // secret of length 20

    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) console.log(err)
      else console.log(data_url); // get QR code data URL
    });
  }

}

export default Totp
