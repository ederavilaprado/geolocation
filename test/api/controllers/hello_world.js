'use strict'
const should = require('should');
const request = require('supertest');
const server = require('../../../app');

// CAUTION: ensure the db is empty before start
// TODO: mock db to use with this tests

describe('testing controllers', function() {
  describe('return all properties inside a square', function() {
    describe('get /property', function() {

      it('should return http_status = 200 and more than 100 properties', function(done) {
        request(server)
          .get('/v1/properties')
          .query({ax:1200, ay:100, bx: 1400, by: 1})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.should.have.property('foundProperties').which.is.a.Number().which.is.aboveOrEqual(100)
            done();
          });
      });
    });
  });
});
