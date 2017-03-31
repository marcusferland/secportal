import React from 'react'
import classNames from 'classnames'
import { Link, withRouter } from 'react-router'
import Cookie from 'react-cookie'
import Axios from 'axios'
import querystring from 'querystring'
import Auth from '../common/auth'

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
export default class Signup extends React.Component {

  constructor(props, context) {
    super(props)

    // user is already logged in (token is verified)
    // redirect them to dashboard
    if ( Auth.isUserAuthenticated() ) this.props.router.replace(::this.getPath('dashboard'))

    this.state = {
      errors: {},
      user: {
        name: '',
        email: '',
        password: '',
        role: ''
      }
    };

    this.processForm = this.processForm.bind(this)
    this.changeUser = this.changeUser.bind(this)
  }

  back(e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.router.goBack()
  }

  componentDidMount() {
    $('html').addClass('authentication')
  }

  componentWillUnmount() {
    $('html').removeClass('authentication')
  }

  processForm(e) {
    e.preventDefault()

    const name = this.state.user.name
    const email = this.state.user.email
    const password = this.state.user.password
    const role = 'esadmin'
    const secret = Auth.generate2FASecret().base32
    const date = new Date()
    const config = {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    }

    Axios
      .post('http://localhost:3001/auth/signup', querystring.stringify({
        name: name,
        email: email,
        password: password,
        role: role,
        secret: secret
      }), config)
      .then(response => {
        if (response.data.token) {
          date.setMinutes(date.getMinutes() + 15)

          Cookie.save('token', response.data.token, {
            domain: 'localhost',
            expires: date,
            maxAge: 900,
            path: '/',
            secure: false
          })
          this.props.router.push(::this.getPath('login'))
        }
        else {
          // ...
        }
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
                        <div>
                          <div style={{padding: 25, paddingTop: 0, paddingBottom: 0, margin: 'auto', marginBottom: 25, marginTop: 25}}>
                            <Form onSubmit={::this.processForm}>
                              <FormGroup controlId='name'>
                                <InputGroup bsSize='large'>
                                  <InputGroup.Addon>
                                    <Icon glyph='icon-fontello-user' />
                                  </InputGroup.Addon>
                                  <FormControl name='name' onChange={::this.changeUser} autoFocus type='text' className='border-focus-blue' placeholder='Name' />
                                </InputGroup>
                              </FormGroup>
                              <FormGroup controlId='emailaddress'>
                                <InputGroup bsSize='large'>
                                  <InputGroup.Addon>
                                    <Icon glyph='icon-fontello-mail' />
                                  </InputGroup.Addon>
                                  <FormControl name='email' onChange={::this.changeUser} type='email' className='border-focus-blue' placeholder='email@address.com' />
                                </InputGroup>
                              </FormGroup>
                              <FormGroup controlId='password'>
                                <InputGroup bsSize='large'>
                                  <InputGroup.Addon>
                                    <Icon glyph='icon-fontello-key' />
                                  </InputGroup.Addon>
                                  <FormControl name='password' onChange={::this.changeUser} type='password' className='border-focus-blue' placeholder='password' />
                                </InputGroup>
                              </FormGroup>
                              <FormGroup>
                                <Grid>
                                  <Row>
                                    <Col xs={12} collapseLeft collapseRight>
                                      <Button type='submit' outlined lg bsStyle='blue' block>Create account</Button>
                                    </Col>
                                  </Row>
                                </Grid>
                              </FormGroup>
                            </Form>
                          </div>
                          <div className='bg-hoverblue fg-black50 text-center' style={{padding: 25, paddingTop: 12.5}}>
                            <div style={{marginBottom: 12.5}}>SIGN UP WITH</div>
                            <Grid>
                              <Row>
                                <Col xs={12} sm={6} smCollapseRight>
                                  <Button block type='submit' id='facebook-btn' lg bsStyle='darkblue' onClick={::this.back}>
                                    <Icon glyph='icon-fontello-facebook' />
                                    <span>Facebook</span>
                                  </Button>
                                  <br className='visible-xs' />
                                </Col>
                                <Col xs={12} sm={6}>
                                  <Button block type='submit' id='twitter-btn' lg bsStyle='darkblue' onClick={::this.back}>
                                    <Icon glyph='icon-fontello-twitter' />
                                    <span>Twitter</span>
                                  </Button>
                                </Col>
                              </Row>
                            </Grid>
                            <div style={{marginTop: 25}}>
                              Already have an account? <Link to={::this.getPath('login')}>Login</Link>
                            </div>
                          </div>
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
