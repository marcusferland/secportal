import React from 'react'
import jwt from 'jsonwebtoken'
import Cookie from 'react-cookie'
import axios from 'axios'
import querystring from 'querystring'

class Auth extends React.Component {

  componentDidMount() {
    this.state = {
      user: {
        email: '',
        password: ''
      },
      token: Cookie.load('token') || null
    }
  }

  static go() {
    return this.requestToken()
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return this.verifyToken()
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    Cookie.remove('token', '/')
    // localStorage.removeItem('token');
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */
  static getToken() {
    return Cookie.load('token')
    // return localStorage.getItem('token')
  }

  /**
   * Check JWT for validity
   */
  static verifyToken() {
    const token = this.getToken()
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

}

export default Auth
