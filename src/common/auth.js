import React from 'react'
import jwt from 'jsonwebtoken'
import Cookie from 'react-cookie'
import speakeasy from 'speakeasy'

import Config from './config'

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
    const verified = this.verifyToken(whichToken)
    return verified.user.id
  }

  /**
   * @return {string}
   */
  static getUserEmail(whichToken = 'token') {
    const verified = this.verifyToken(whichToken)
    return verified.user.email
  }

  /**
   * @return {string}
   */
  static getUserName(whichToken = 'token') {
    const verified = this.verifyToken(whichToken)
    return verified.user.name
  }

  /**
   * @return {string}
   */
  static getUserRole(whichToken = 'token') {
    const verified = this.verifyToken(whichToken)
    return verified.user.role
  }

  /**
   * @return {array}
   */
  static getUserBackupTotp(whichToken = 'token') {
    const verified = this.verifyToken(whichToken)

    if (verified) return verified.user.backup_totp
    else return false
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
        verified = jwt.verify(token, Config.jwt.secret)
        return verified
      } catch (err) {
        return false
      }
    }
    else { return false }
  }

}

export default Auth
