import React, { PropTypes } from 'react'
import {  withRouter } from 'react-router'

import speakeasy from 'speakeasy'
import qrCode, { toDataURL } from 'qrcode'

import {
  Row,
  Col,
  Icon,
  Grid,
  Form,
  Badge,
  Panel,
  Button,
  PanelBody,
  FormGroup,
  LoremIpsum,
  InputGroup,
  FormControl,
  ButtonGroup,
  ButtonToolbar,
  PanelContainer,
} from '@sketchpixy/rubix'

@withRouter
class Totp extends React.Component {

  state = {
    name: ''
  }
  componentDidMount() {
    this.setState({name: 'Marc'})
    const secret = speakeasy.generateSecret({ length: 20 })
    console.log(secret)
    qrCode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) console.log(err)
      else console.log(data_url) // get QR code data URL
      // this.setState({qrCode: data_url})
    });
  }

  render() {
    return (
      <div>
        <h1>{this.state.name}</h1>
      </div>
    )
  }
}

export default Totp
