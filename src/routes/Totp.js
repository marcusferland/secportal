import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Link, withRouter } from 'react-router'
import cookie from 'react-cookie'
import axios from 'axios'
import querystring from 'querystring'
import qr from 'qrcode'
import speakeasy from 'speakeasy'
import jwt from 'jsonwebtoken'

import Auth from '../common/auth'
import Config from '../common/config'

import {
  Row,
  Col,
  Icon,
  Grid,
  Form,
  Image,
  Panel,
  Button,
  PanelBody,
  FormGroup,
  InputGroup,
  FormControl,
  PanelContainer,
} from '@sketchpixy/rubix'

@withRouter
export default class Totp extends React.Component {

  constructor(props, context) {
    super(props)

    this.state = {
      errors: {},
      user: {
        qrcode: '',
        token: '',
        totp: ''
      }
    }

    this.processForm = this.processForm.bind(this)
    this.changeUser = this.changeUser.bind(this)
  }

  componentDidMount() {
    axios({
      method: 'get',
      url: 'http://localhost:3000/jwt',
      headers: {
        'Authorization': `Bearer ${Auth.getToken('authed')}`
      }
    })
    .then(res => {
      this.setState({
        qrcode: res.data.url,
        token: res.data.token
      })
    })
    .catch(err => {})
  }

  back(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.router.goBack()
  }

  alert(msg = null) {
    vex.dialog.alert(msg)
  }

  processForm(e) {
    e.preventDefault()

    const tokenPayload = Auth.verifyToken('authed')
    if ( ! tokenPayload) return this.props.router.push(::this.getPath('login'))

    /**
     * Check to see if user entered a recovery code
     * If yes, authenticate and remove recovery code from {array} in MongoDB
     * If no, prompt user to try again (with another recovery code?)
     */
    const reg = /^[0-9a-z]{5}\-[0-9a-z]{5}$/
    if ( reg.test(this.state.user.totp) ) {

      const backupTotps = tokenPayload.user.backup_totp
      const backupTotpsIndex = backupTotps.indexOf(this.state.user.totp)

      if ( backupTotpsIndex !== -1 ) {
        backupTotps.splice(backupTotpsIndex, 1)

        // update MongoDB
        const config = {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }

        axios
          .put('http://localhost:3001/auth/update/recovery_codes', querystring.stringify({
            userid: Auth.getUserId('authed'),
            totps:  backupTotps
          }), config)
          .then(response => {
            if (response.data) {
              return response.data
            }
          })
          .catch(error => {})

        const payload = {
          user: tokenPayload.user
        }

        const token = jwt.sign(
          payload,
          Config.jwt.secret, {
            expiresIn: Config.jwt.expiry
          }
        )

        if (token) {
          cookie.save('token', token, Config.cookies.config)
          cookie.remove('authed', '/')

          // good; send to dashboard
          this.props.router.push(::this.getPath('dashboard'))
          return
        }
        else {
          ::this.alert('Not verified!')
          return
        }
      }
    }

    const verified = speakeasy.totp.verify({
      secret: Auth.verifyToken('authed').user.secret,
      encoding: 'base32',
      token: this.state.user.totp
    })

    if (verified) {
      const payload = {
        user: tokenPayload.user
      }

      /**const token = jwt.sign(
        payload,
        Config.jwt.secret, {
          expiresIn: Config.jwt.expiry
        }
      )*/

      // get new access token
      const refreshTokenConfig = {
        headers: {
          'Authorization': 'Basic dGVzdGNsaWVudDpzZWNyZXQ=',
          'Content-type': 'application/x-www-form-urlencoded'
        }
      }
      let token = null

      axios
        .post('http://localhost:3004/oauth/token', querystring.stringify({
          grant_type: 'refresh_token',
          refresh_token: '3263949a2ff74256e8eac02fb901e98b05f2752a'
        }), refreshTokenConfig)
        .then(response => {
          if (response.data) {
            token = response.data.access_token

            cookie.save('token', token, Config.cookies.config)
            cookie.remove('authed', '/')

            // we good; send to dashboard
            this.props.router.push(::this.getPath('dashboard'))
          }
          else {
            ::this.alert('Not verified!')
            return
          }
        })
        .catch(error => {
          ::this.alert(error)
          return
        })
    }
    else {
      ::this.alert('Could not verify your code. Please try again.')
      return
    }
  }

  getHelp() {
    ::this.alert('<a href="https://support.google.com/accounts/answer/1066447?hl=en" target="_blank">Install Google Authenticator</a>')
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name
    const user = this.state.user
    user[field] = event.target.value

    this.setState({
      user
    })
  }

  getPath(path) {
    var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr'
    path = `/${dir}/${path}`
    return path
  }

  render() {
    return (
      <div id='auth-container' className='login' style={{backgroundImage: "url(/imgs/common/background.jpg)"}}>
        <div id='auth-row'>
          <div id='auth-cell'>
            <Grid>
              <Row>
                <Col sm={4} smOffset={4} xs={10} xsOffset={1} collapseLeft collapseRight>
                  <PanelContainer controls={false}>
                    <Panel>
                      <PanelBody style={{padding: 0}}>
                        <div className='text-center bg-esentire fg-white'>
                          <h3 style={{margin: 0, padding: 25}}>
                            <img src='/imgs/common/esentire-logo-white.png' height='40' />
                          </h3>
                        </div>
                        <div style={{padding: 25, paddingTop: 0, paddingBottom: 0, margin: 'auto', marginBottom: 25, marginTop: 25}}>
                          <div>
                            <h4><strong>1. Scan this barcode with your app</strong></h4>
                            <small>Scan the image below with the two-factor authentication app on your phone (Eg. <a href='javascript:void(0)' onClick={::this.getHelp}>Google Authenticator</a>).
                            If you cannot use a barcode <a href="#">enter this text code</a> instead.</small>
                          </div>
                          <div className='text-center'>
                            <Image style={{border:'1px #EEEEEE solid', margin: '3rem auto'}} src={this.state.qrcode} />
                          </div>
                          <div>
                            <h4><strong>2. Enter the six-digit code from the application</strong></h4>
                            <small>After scanning the barcode image, the app will display a six-digit code that you can enter below.</small>
                          </div><br/>
                          <Form onSubmit={this.processForm} method='post'>
                            <FormGroup controlId='emailaddress'>
                              <InputGroup bsSize='large'>
                                <InputGroup.Addon>
                                  <Icon glyph='icon-fontello-lock' />
                                </InputGroup.Addon>
                                <FormControl value={this.state.totp} name='totp' onChange={::this.changeUser} autoFocus type='text' className='border-focus-blue' placeholder='123456' />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup>
                              <Grid>
                                <Row>
                                  <Col xs={12} collapseLeft collapseRight className='text-right'>
                                    <Button lg type='submit' bsStyle='green'>Finish login <Icon glyph='icon-feather-arrow-right'/></Button>
                                  </Col>
                                </Row>
                              </Grid>
                            </FormGroup>
                          </Form>
                        </div>
                      </PanelBody>
                    </Panel>
                  </PanelContainer>
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    )
  }
}
