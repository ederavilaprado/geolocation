'use strict';

var SwaggerRestify = require('swagger-restify-mw');
var restify = require('restify');
var app = restify.createServer();
const config = require('config');

module.exports = app; // for testing

var startConfig = {
  appRoot: __dirname // required config
};

SwaggerRestify.create(startConfig, function(err, swaggerRestify) {
  if (err) { throw err; }

  swaggerRestify.register(app);

  let port = config.get('port');
  app.listen(port);

  if (swaggerRestify.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/healthcheck');
  }
});
