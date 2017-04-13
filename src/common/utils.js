'use strict'

module.exports = {

  /**
   * Simple way to truncate number and add appropriate type
   */
  nFormatter: function(num = 0) {
    if (num >= 1000000000)
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G'

    if (num >= 1000000)
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'

    if (num >= 1000)
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'

    return num
  },

  /**
   * Generates array of random floats based on arguments
   * Example usage: rand = randomFloatBetween(0, 100) // 13
   *
   * @param minValue {int} -> minimum value integer to use
   * @param maxValue {int} -> maximum value integer to use
   * @param precision {int} -> float precision
   * @param num {int} -> number of items in list/array
   *
   * @return {array}
   */
  randomFloatBetween: function(minValue, maxValue, precision = 2, num = 30) {
    const arr = []
    for (let i = 0; i <= num; i++) {
      arr.push( parseInt( Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue).toFixed(precision) ) )
    }
    return arr
  },

  /**
   * Generates a list of 16 recovery codes in the case the user doesn't have
   * access to their device, ie. smart phone, etc.
   *
   * @return {array} ex. [ 1dpwa-dm022, 82nzw-q5y60, ... ]
   */
  calcBackupTotpNumbers: function() {
    const list = []
  	for (let num = 0; num < 16; num++) {
    	list.push( Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(1, 5) + '-' +
                 Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(1, 5) )
    }
    return list
  },

  /**
   * Formats a JavaScript Date object
   */
   formatDate: function(date = new Date()) {
     const monthNames = [
       "January", "February", "March",
       "April", "May", "June", "July",
       "August", "September", "October",
       "November", "December"
     ]

     const day = date.getDate()
     const monthIndex = date.getMonth()
     const year = date.getFullYear()

     return `${monthNames[monthIndex]} ${day}, ${year}`
   },

}
