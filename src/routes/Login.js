import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Link, withRouter } from 'react-router'
import cookie from 'react-cookie'
import axios from 'axios'
import querystring from 'querystring'

import Auth from '../common/auth'
import Config from '../common/config'
import { formatDate } from '../common/utils'
import Totp from '../routes/Totp'

import {
  Row,
  Col,
  Icon,
  Grid,
  Form,
  Panel,
  Button,
  PanelBody,
  FormGroup,
  InputGroup,
  FormControl,
  PanelContainer,
} from '@sketchpixy/rubix'

@withRouter
class Login extends React.Component {
  back(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.router.goBack()
  }

  constructor(props, context) {
    super(props)

    this.state = {
      errors: {},
      user: {
        email: '',
        password: ''
      }
    }

    this.processForm = this.processForm.bind(this)
    this.changeUser = this.changeUser.bind(this)

    this.systemMessage = true
    this.date = new Date()
  }

  componentDidMount() {
    $('html').addClass('authentication')


    if (this.systemMessage) {
      Messenger.options = {
        theme: 'flat'
      }
      Messenger().post({
        hideAfter: 3600,
        id: 'info',
        type: 'info',
        singleton: true,
        message: `<h4 style='margin-top:5px'><b>System Messages</b></h4><b>${formatDate(this.date)}</b>: Planned system maintenance. Work will commence shortly and should resolve in ~2-3 hours.`,
        showCloseButton: true
      })
    }
  }

  componentWillUnmount() {
    $('html').removeClass('authentication')
  }

  processForm(e) {
    e.preventDefault()

    const email = this.state.user.email
    const password = this.state.user.password
    const config = {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    }

    axios
      .post('http://localhost:3001/auth/login', querystring.stringify({
        email: email,
        password: password
      }), config)
      .then(response => {
        if (response.data.success == true) {
          if (response.data.token) {
            cookie.save('authed', response.data.token, Config.cookies.config)
            this.props.router.push(::this.getPath('totp'))
          }
        }
        else {}
      })
      .catch(error => {
        console.log(error)
      })
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
    var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
    path = `/${dir}/${path}`;
    return path;
  }

  render() {
    return (
      <div id='auth-container' className='login'>
        <div id='auth-row'>
          <div id='auth-cell'>
            <Grid>
              <Row>
                <Col sm={4} smOffset={4} xs={10} xsOffset={1} collapseLeft collapseRight>
                  <PanelContainer controls={false} className='login-container'>
                    <Panel>
                      <PanelBody style={{padding: 0}}>
                        <div className='text-center bg-esentire fg-white'>
                          <h3 style={{margin: 0, padding: 25}}>
                            <img src='/imgs/common/esentire-logo-white.png' height='40' />
                          </h3>
                        </div>
                        <div style={{padding: 25, paddingTop: 0, paddingBottom: 0, margin: 'auto', marginBottom: 25, marginTop: 25}}>
                          <Form onSubmit={this.processForm} method='post'>
                            <FormGroup controlId='emailaddress'>
                              <InputGroup bsSize='large'>
                                <InputGroup.Addon>
                                  <Icon glyph='icon-fontello-mail' />
                                </InputGroup.Addon>
                                <FormControl value={this.state.user.email} name='email' onChange={this.changeUser} autoFocus type='email' className='border-focus-blue' placeholder='email@address.com' />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup controlId='password'>
                              <InputGroup bsSize='large'>
                                <InputGroup.Addon>
                                  <Icon glyph='icon-fontello-key' />
                                </InputGroup.Addon>
                                <FormControl value={this.state.user.password} name='password' onChange={this.changeUser} type='password' className='border-focus-blue' placeholder='password' />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup>
                              <Grid>
                                <Row>
                                  <Col xs={6} collapseLeft collapseRight style={{paddingTop: 10}}>
                                    <Link to={::this.getPath('signup')}>Create an eSentire account</Link>
                                  </Col>
                                  <Col xs={6} collapseLeft collapseRight className='text-right'>
                                    <Button outlined lg type='submit' bsStyle='blue'>Login</Button>
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
    );
  }
}

export default Login
