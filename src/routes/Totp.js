import React, { Component } from 'react'
import axios from 'axios'
import { Image } from '@sketchpixy/rubix'
import qr from 'qrcode'

export default class Totp extends React.Component {
  constructor(props, context) {
    super(props)
    this.state = {
      qrcode: ''
    }
  }
  componentDidMount() {
    axios
      .get('http://localhost:3000')
      .then(res => {
        this.setState({
          qrcode: res.data
        })
      })
      .catch(err => {})
  }
  render() {
    return (
      <Image src={this.state.qrcode} />
    )
  }
}
