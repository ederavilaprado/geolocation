const _ = require('lodash')

function ValidationError(message) {
  this.name = 'ValidationError'
  this.type = _.chain(this.name).snakeCase().toUpper().value()
  this.message = message || 'Validation error found'
  this.stack = (new Error()).stack
}
ValidationError.prototype = Object.create(Error.prototype)
ValidationError.prototype.constructor = ValidationError

function NotFoundError(message) {
  this.name = 'NotFoundError'
  this.type = _.chain(this.name).snakeCase().toUpper().value()
  this.message = message || 'Not found'
  this.stack = (new Error()).stack
}
NotFoundError.prototype = Object.create(Error.prototype)
NotFoundError.prototype.constructor = NotFoundError


function GenericBusinessError(code, message) {
  this.name = 'GenericBusinessError'
  this.type = _.chain(this.name).snakeCase().toUpper().value()
  this.code = code
  this.message = message || 'Business error found'
  this.stack = (new Error()).stack
}
GenericBusinessError.prototype = Object.create(Error.prototype)
GenericBusinessError.prototype.constructor = GenericBusinessError


module.exports = {
  ValidationError: ValidationError,
  GenericBusinessError: GenericBusinessError,
  NotFoundError: NotFoundError,
}
