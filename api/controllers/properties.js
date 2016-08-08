'use strict';

const property = require('../models/property')
const config = require('config')
const errors = require('../helpers/errors')


function addProperty(req, res) {
  property.create(req.swagger.params.body.value, function createPropertyHandler(err, r) {
    if (err) {
      // TODO: log here
      // TODO: put this in a centralized place
      if (err instanceof errors.GenericBusinessError) {
        return res.json(409, { // or 422?!?
          message: err.message,
          code: err.code,
        })
      } else {
        return res.json(500, {
          message: 'Internal server error',
        })
      }
    }

    // TODO: should move this to a better place
    let basePath = req.swagger.swaggerObject.schemes[0]
    basePath += '://' + req.swagger.swaggerObject.host
    basePath += req.swagger.swaggerObject.basePath

    res.header('Location', basePath + '/properties/' + r.id)
    return res.json(201, r)
  })
}

function getProperty(req, res) {
  property.getById(req.swagger.params.id.value, function getProperty(err, property) {
    if (err) {
      // TODO: log here
      // TODO: put this in a centralized place
      if (err instanceof errors.NotFoundError) {
        return res.json(404, {
          message: err.message,
        })
      } else {
        return res.json(500, {
          message: 'Internal server error',
        })
      }
    }
    return res.json(property)
  })
}

function searchProperties(req, res) {
  let p = {
    "upperLeft" : {
      "x" : req.swagger.params.ax.value,
      "y" : req.swagger.params.ay.value
    },
    "bottomRight" : {
      "x" : req.swagger.params.bx.value,
      "y" : req.swagger.params.by.value
    }
  }

  property.searchProperties(p, function searchPropertiesCb(err, properties) {
    if (err) {
      // TODO: log here
      // TODO: put this in a centralized place
      return res.json(500, {
        message: 'Internal server error',
      })
    }
    return res.json({
      foundProperties: properties.length,
      properties: properties,
    })
  })
}

module.exports = {
  addProperty: addProperty,
  getProperty: getProperty,
  searchProperties: searchProperties,
};
