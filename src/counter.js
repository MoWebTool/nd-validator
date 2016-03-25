/**
 * @module Validator
 * @author crossjs <liwenfu@crossjs.com>
 */

'use strict'

var store = {}

module.exports = {
  increase: function(explain, element) {
    var index = explain.attr('store-index')

    if (!index) {
      index = new Date().getTime()
      explain.attr('store-index', index)
    }

    var id = element[0].id

    if (!store[index]) {
      store[index] = []
    }

    if (store[index].indexOf(id) === -1) {
      store[index].push(id)
    }
  },

  decrease: function(explain, element) {
    var index = explain.attr('store-index')

    if (!index) {
      return 0
    }

    if (!store[index]) {
      return 0
    }

    var id = element[0].id
    var idx = store[index].indexOf(id)

    if (idx !== -1) {
      store[index].splice(idx, 1)
    }

    return store[index].length
  }
}
