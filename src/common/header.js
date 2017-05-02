import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import axios from 'axios'
import querystring from 'querystring'
import Cookie from 'react-cookie'
import { Link, withRouter } from 'react-router'
import Auth from './auth'

import {
  Nav,
  Row,
  Col,
  Icon,
  Grid,
  Navbar,
  NavItem,
  SidebarBtn
} from '@sketchpixy/rubix'

@withRouter
class Brand extends React.Component {
  getPath(path) {
    var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
    path = `/${dir}/${path}`;
    return path;
  }
  render() {
    return (
      <Navbar.Header>
        <Navbar.Brand tabIndex='-1'>
          <a href={::this.getPath('dashboard')}>
            <img src='/imgs/common/esentire-logo-white.png' alt='eSentire' height='28' />
          </a>
        </Navbar.Brand>
      </Navbar.Header>
    );
  }
}

@withRouter
class HeaderNavigation extends React.Component {

  handleLogout(e) {
    const headers = {
      headers: {
        'Authorization': 'Basic dGVzdGNsaWVudDpzZWNyZXQ=',
        'Content-type': 'application/x-www-form-urlencoded'
      }
    }

    axios
      .post('http://localhost:8080/user/logout', querystring.stringify({
        refreshToken: Cookie.load('refreshToken')
      }), headers)
      .then(response => {
        Auth.deauthenticateUser()
        this.props.router.push(::this.getPath('login'))
      })
      .catch(err => {
        return err
      })
  }

  getPath(path) {
    var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
    path = `/${dir}/${path}`;
    return path;
  }

  render() {
    return (
      <Nav pullRight>
        <Nav>
          <NavItem className='logout' href='#' onClick={::this.handleLogout}>
            <Icon bundle='fontello' glyph='off-1' />
          </NavItem>
        </Nav>
      </Nav>
    );
  }
}

export default class Header extends React.Component {
  render() {
    return (
      <Grid id='navbar' {...this.props}>
        <Row>
          <Col xs={12}>
            <Navbar fixedTop fluid id='rubix-nav-header'>
              <Row>
                <Col xs={3} visible='xs'>
                  <SidebarBtn />
                </Col>
                <Col xs={6} sm={4}>
                  <Brand />
                </Col>
                <Col xs={3} sm={8} collapseRight className='text-right'>
                  <HeaderNavigation />
                </Col>
              </Row>
            </Navbar>
          </Col>
        </Row>
      </Grid>
    );
  }
}
