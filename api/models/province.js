'use strict'
// TODO: improve this model storing data to db

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const errors = require('../helpers/errors')

const provinces = JSON.parse(fs.readFileSync( path.resolve(__dirname, '..', '..', 'temp', 'provinces.json'), 'utf8'))


function getProvinces(x, y, callback) {
  // TODO: validate params here

  let p = _.reduce(provinces, function(result, value, key) {
    let bu = value.boundaries.upperLeft,
        bb = value.boundaries.bottomRight
    if (x >= bu.x && x <= bb.x && y <= bu.y && y >= bb.y) result.push(key)
    return result
  }, []);

  if (p.length == 0) {
    return callback(new errors.GenericBusinessError('OUTSITE_BOUNDARIES', 'Location outsite the boundaries of Spotippos'))
  }
  return callback(null, p)
}

module.exports = {
  getProvinces: getProvinces,
}
