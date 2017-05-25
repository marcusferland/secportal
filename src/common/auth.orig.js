import React from 'react'
import jwt from 'jsonwebtoken'
import Cookie from 'react-cookie'
import speakeasy from 'speakeasy'
import axios from 'axios'
import config from './config'

class Auth extends React.Component {

  constructor(props, context) {
    super(props)

    this.state = {
      user: {
        email: '',
        password: ''
      },
      token: Cookie.load('token') || null,
      secret: ''
    }
  }

  static setUserRefreshToken(key = 'refreshToken', value = null) {
    const date = new Date()

    date.setMinutes(date.getMinutes() + 15)
    Cookie.save(key, value, {
      domain: cookieObj.domain, // localhost
      expires: date,
      maxAge: cookieObj.maxAge, // 900
      path: cookieObj.path, // '/'
      secure: cookieObj.secure // true|false
    })
  }

  static getUserRefreshToken() {
    return Cookie.load('refreshToken')
    // return 'e0aaa92c71cecb9ed73fb35bf544029dc9651c29'
  }

  /**
   * @return {string}
   */
  static generate2FASecret() {
    return speakeasy.generateSecret({ length: 20 })
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @return {boolean}
   */
  static isUserAuthenticated(whichToken = 'token') {
    return this.verifyToken(whichToken)
  }

  /**
   * @return {int}
   */
  static getUserId(whichToken = 'token') {
    if (this.getToken()) {
      const verified = this.verifyToken(whichToken)
      return verified.user.id
    }
    return false
  }

  /**
   * @return {string}
   */
  static getUserEmail(whichToken = 'token') {
    if (this.getToken()) {
      const verified = this.verifyToken(whichToken)
      return verified ? verified.user.email : false
    }
    return false
  }

  /**
   * @return {string}
   */
  static getUserName(whichToken = 'token') {
    if (this.getToken()) {
      const verified = this.verifyToken(whichToken)
      return verified.user.name
    }
    return false
  }

  /**
   * @return {string}
   */
  static getUserRole(whichToken = 'token') {
    if (this.getToken()) {
      const verified = this.verifyToken(whichToken)
      if (verified) return verified.user.role
    }
    return false
  }

  /**
   * @return {array}
   */
  static getUserBackupTotp(whichToken = 'token') {
    if (this.getToken()) {
      const verified = this.verifyToken(whichToken)
      if (verified) return verified.user.backup_totp
    }
    return false
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    Cookie.remove('token', '/')
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */
  static getToken(whichToken = 'token') {
    return Cookie.load(whichToken)
  }

  /**
   * method to set cookies
   *
   * @param {object} cookieObj
   */
  static setCookie(cookieObj) {
    const date = new Date()

    date.setMinutes(date.getMinutes() + 15)
    Cookie.save(cookieObj.name, cookieObj.token, {
      domain: cookieObj.domain, // localhost
      expires: date,
      maxAge: cookieObj.maxAge, // 900
      path: cookieObj.path, // '/'
      secure: cookieObj.secure // true|false
    })
  }

  /**
   * Check JWT for validity
   */
  static verifyToken(whichToken = 'token') {
    const token = this.getToken(whichToken)
    let verified = false

    if (token) {
      try {
        verified = jwt.verify(token, config.jwt.secret)
        return verified
      } catch (err) {
        return false
      }
    }
    else { return false }
  }

}

export default Auth