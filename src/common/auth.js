import React from 'react'
import jwt from 'jsonwebtoken'
import Cookie from 'react-cookie'
import speakeasy from 'speakeasy'

class Auth extends React.Component {

  componentDidMount() {
    this.state = {
      user: {
        email: '',
        password: ''
      },
      token: Cookie.load('token') || null,
      secret: ''
    }
  }

  static generate2FASecret() {
    return speakeasy.generateSecret({ length: 20 })
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated(whichToken = 'token') {
    return this.verifyToken(whichToken)
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    Cookie.remove('authed', '/')
    Cookie.remove('token', '/')
    // localStorage.removeItem('token');
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */
  static getToken(whichToken = 'token') {
    return Cookie.load(whichToken)
    // return localStorage.getItem('token')
  }

  /**
   * Check JWT for validity
   */
  static verifyToken(whichToken = 'token') {
    const token = this.getToken(whichToken)
    let verified = false

    if (token) {
      try {
        verified = jwt.verify(token, 'rH!y+sZcK-_a TTZyDWjPGAJ q-RF&6-GW')
        return verified
      } catch (err) {
        return false
      }
    }
    else { return false }
  }

  static generateTotpToken() {
    Cookie.save('token', ::this.getToken('authed'))
    Cookie.remove('authed')
    return
  }

}

export default Auth
