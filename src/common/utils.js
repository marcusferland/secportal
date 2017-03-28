import React from 'react'
import { withRouter } from 'react-router'

@withRouter
export default class Utils extends React.Component {

  /**
   * Gets path
   *
   * @param {string} path
   * @return {string}
   */
  static getPath(path) {
    const dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
    path = `/${dir}/${path}`;
    return path;
  }
}
