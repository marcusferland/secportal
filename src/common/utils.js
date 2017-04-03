'use strict'

/**
 * Generates a list of 16 recovery codes in the case the user doesn't have
 * access to their device, ie. smart phone, etc.
 *
 * @return {array} ex. [ 1dpwa-dm022, 82nzw-q5y60, ... ]
 */
module.exports.calcBackupTotpNumbers = () => {
  const list = []
	for (let num = 0; num < 16; num++) {
  	list.push( Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(1, 5) + '-' +
               Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(1, 5) )
  }
  return list
}
