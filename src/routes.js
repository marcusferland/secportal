import React from 'react'
import classNames from 'classnames'
import { IndexRoute, Route } from 'react-router'
import axios from 'axios'
import cookie from 'react-cookie'
import querystring from 'querystring'
import co from 'co'
import Config from './common/config'

import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix'

/* Common Components */

import Sidebar from './common/sidebar'
import Header from './common/header'
import Footer from './common/footer'
import Auth from './common/auth'

/* Pages */

import Homepage from './routes/Homepage'
import Dashboard from './routes/Dashboard'
import Security from './routes/Security'
import Login from './routes/Login'
import Signup from './routes/Signup'
import Lock from './routes/Lock'

function requireAuth(nextState, replace, cb) {
  co(function*() {
    if ( ! Auth.isUserAuthenticated() ) {
      if ( ! Auth.getUserRefreshToken() ) {
        replace({
          pathname: '/ltr/login'
        })
      }

      const refreshTokenConfig = {
        headers: {
          'Authorization': 'Basic dGVzdGNsaWVudDpzZWNyZXQ=',
          'Content-type': 'application/x-www-form-urlencoded'
        }
      }
      let token = null

      yield axios.post('http://localhost:3001/token', querystring.stringify({
                    grant_type: 'refresh_token',
                    token: Auth.getUserRefreshToken()
                  }), refreshTokenConfig)
                  .then(response => {
                    localStorage.removeItem('user')
                    cookie.save('token', response.data.access_token, Config.cookies.config)
                    localStorage.setItem('user', JSON.stringify(response.data.user))
                    cb()
                  })
                  .catch(err => {
                    replace({
                      pathname: '/ltr/login'
                    })
                  })
    }
  })
  cb()
}

function isAuthed(nextState, replace) {
  if ( Auth.isUserAuthenticated() ) {
    return replace({
      pathname: '/ltr/dashboard'
    })
  }
}

class App extends React.Component {
  render() {
    return (
      <MainContainer {...this.props}>
        <Sidebar />
        <Header />
        <div id='body'>
          <Grid>
            <Row>
              <Col xs={12}>
                {this.props.children}
              </Col>
            </Row>
          </Grid>
        </div>
        <Footer />
      </MainContainer>
    )
  }
}

/**
 * Includes Sidebar, Header and Footer.
 */
const routes = (
  <Route component={App}>
    <Route path='dashboard' component={Dashboard} onEnter={requireAuth} />
    <Route path='settings/security' component={Security} onEnter={requireAuth} />
  </Route>
)

/**
 * No Sidebar, Header or Footer. Only the Body is rendered.
 */
const basicRoutes = (
  <Route>
    <Route path='lock' component={Lock} />
    <Route path='login' component={Login} onEnter={isAuthed} />
    <Route path='signup' component={Signup} onEnter={isAuthed} />
  </Route>
)

const combinedRoutes = (
  <Route>
    <Route>
      {routes}
    </Route>
    <Route>
      {basicRoutes}
    </Route>
  </Route>
)

export default (
  <Route>
    <Route path='/' component={Homepage} />

    <Route path='/ltr'>
      {combinedRoutes}
    </Route>
  </Route>
)
