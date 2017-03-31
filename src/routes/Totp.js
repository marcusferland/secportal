import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Link, withRouter } from 'react-router'
import Auth from '../common/auth'
import cookie from 'react-cookie'
import axios from 'axios'
import querystring from 'querystring'
import qr from 'qrcode'
import speakeasy from 'speakeasy'
import jwt from 'jsonwebtoken'

import {
  Row,
  Col,
  Icon,
  Grid,
  Form,
  Badge,
  Image,
  Modal,
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
export default class Totp extends React.Component {

  constructor(props, context) {
    super(props)

    // user is attempting to access this page directly
    // redirect them to login page
    if ( ! Auth.isUserAuthenticated('authed') ) this.props.router.replace(::this.getPath('login'))

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
    vex.dialog.alert(msg);
  }

  processForm(e) {
    e.preventDefault()

    const verified = speakeasy.totp.verify({
      secret: Auth.verifyToken('authed').user.secret,
      encoding: 'base32',
      token: this.state.user.totp
    })

    if (verified) {
      const tokenPayload = Auth.verifyToken('authed')
      const payload = {
        sub: tokenPayload.sub,
        sub: tokenPayload.user
      }

      const token = jwt.sign(
        payload,
        'rH!y+sZcK-_a TTZyDWjPGAJ q-RF&6-GW', {
          expiresIn: 900
        }
      )

      if (token) {

        const date = new Date()
        date.setMinutes(date.getMinutes() + 15)
        cookie.save('token', token, {
          domain: 'localhost',
          expires: date,
          maxAge: 900,
          path: '/',
          secure: false
        })

        // good; send to dashboard
        this.props.router.push(::this.getPath('dashboard'))
      }
      else {
        ::this.alert('Not verified!')
      }
    }
    else {
      ::this.alert('Not verified!')
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
