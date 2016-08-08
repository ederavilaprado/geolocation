'use strict'
const levelup = require('levelup')

// TODO: check if any error when starting

module.exports = levelup('./db', {valueEncoding:'json'})
