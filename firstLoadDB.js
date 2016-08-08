'use strict'

// first load for properties
const fs = require('fs')
const path = require('path')
const property = require('./api/models/property')
const async = require('async')
const _ = require('lodash')

const propertiesFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'temp', 'properties.json'), 'utf8'))

console.log('Loading properties from file...');

var errors = {}
async.each(propertiesFile.properties, function(item, callback) {
  // fix to load properties...
  item.x = item.lat
  item.y = item.long
  delete item.lat
  delete item.long

  property.create(item, function createProperty(err, r) {
    if (err) {
      errors[item.id] = err
    }
    return callback()
  })
}, function() {
  console.log('Finished loading properties from file');
  if (_.keys(errors).length > 0) {
    console.log(errors);
  }

})
