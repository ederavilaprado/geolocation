'use strict'

const uuid = require('node-uuid');
const db = require('./db')
const errors = require('../helpers/errors')
const province = require('./province')
const async = require('async')
const _ = require('lodash')

// createHash generates a hash from the position (lat, long),
// used as a key to store data on DB
function createHash(x, y) {
  if ( (typeof(x) !== 'number' || typeof(y) !== 'number') ||
        typeof(x) === 'number' && typeof(y) === 'number' && (x < 0 || y < 0) ) {
    throw new errors.ValidationError('Invalid params to generate the hash.')
  }
  let hash = 'places!x:' + ('0000' + x).slice(-4)
  hash += '!y:' + ('0000' + y).slice(-4)
  return hash
}

// save a new property to db
function create(params, callback) {
  let hash;

  // check params
  // try {
  //   validateParams(params)
  // } catch (e) {
  //   return callback(e)
  // }
  // check and create hash (key of the storage)
  try {
    hash = createHash(params.x, params.y)
  } catch (e) {
    return callback(e);
  }

  // TODO: if think we should change this to use http://bluebirdjs.com/ or http://caolan.github.io/async

  db.get(hash, function getPropertyFromDB(err, property) {
    if (err && err.type !== 'NotFoundError') return callback(err)
    // place already registered on db, return error
    if (!err) {
      return callback(new errors.GenericBusinessError('LOCATION_ALREADY_TAKEN', 'There is already a registered property at this location'))
    }

    params.id = uuid.v4()

    province.getProvinces(params.x, params.y, function functionName(err, provinces) {
      if (err) return callback(err)
      params.provinces = provinces

      let ops = [
        {
          type: 'put',
          key: hash,
          value: params,
        },
        {
          type: 'put',
          key: 'properties!' + params.id,
          value: {key: hash},
        },
      ]
      db.batch(ops, function (err) {
        if (err) return callback(err)
        return callback(null, params)
      })
    })
  })
}

// get a property by id
function getById(id, callback) {
  // Get property key from db
  db.get('properties!' + id, function getPropertyKeyFromDB(err, value) {
    if (err) {
      if (err.type !== 'NotFoundError') return callback(err)
      return callback(new errors.NotFoundError(`Property [${id}] not found`))
    }
    // Get property from db
    db.get(value.key, function getPropertyFromDB(err, value) {
      if (err) return callback(err)
      return callback(null, value)
    })
  })
}

function searchProperties(params, callback) {
  // create map to search for in the sorted index of leveldb
  let cols = []
  for (var x = params.upperLeft.x; x <= params.bottomRight.x; x++) {
    let hashUpper = 'places!x:' + ('0000' + x).slice(-4) + '!y:' + ('0000' + params.bottomRight.y).slice(-4),
        hashBottom = 'places!x:' + ('0000' + x).slice(-4) + '!y:' + ('0000' + params.upperLeft.y).slice(-4)
    cols.push({hashUpper: hashUpper, hashBottom: hashBottom})
  }

  async.mapLimit(cols, 10, function iterator(item, callback) {
    let props = []
    db.createReadStream({
      gte: item.hashUpper,
      lte: item.hashBottom
    }).on('data', function (data) {
        props.push(data.value)
      })
      .on('error', function (err) {
        return callback(err)
      })
      .on('end', function () {
        return callback(null, props)
      })
  },
  function endMap(err, result) {
    if (err) return callback(err)
    return callback(null, _.flatten(result))
  })
}

module.exports = {
  create: create,
  getById: getById,
  searchProperties: searchProperties,
}
