
var http = require('http')
 , assert = require('assert')
 , mongoose = require('mongoose')
 , app = require('../app.js');


// TODO extract models across app
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Task = new Schema({
  task : { 
    type: String, 
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at : Date
});

var Task = mongoose.model('Task', Task);

describe('api v1', function(){

  describe('GET /api/v1/tasks', function(){
    it('should return at 200 response code', function(done){
      http.get({ path: '/api/v1/tasks', port: 3000 }, function(res){
        assert.equal(res.statusCode, 
                     200,
                     'Expected: 404 Actual: ' + res.statusCode );
        done();
      })
    })
  })

  describe('POST /api/v1/tasks/', function(){
    describe('with valid data', function(){
      it('should return at 200 response code')
    })
    describe('with invalid data', function(){
      it('should return at 422 response code', function(done){
        var req = http.request({ path: '/api/v1/tasks', port: 3000, method: 'POST' }, function(res){
          res.setEncoding('utf8');
          assert.equal(res.statusCode, 
                       422, 
                       'Expected: 422 Actual: ' + res.statusCode );
        })
        req.end();
        done();
      })
      it('should return at 404 response code', function(done){
        var req = http.request({ path: '/api/v1/tasks', port: 3000, method: 'POST' }, function(res){
          res.setEncoding('utf8');
          assert.equal(res.headers["content-type"], 
                       "application/json; charset=utf-8", 
                       'Expected: application/json; charset=utf-8 Actual: ' + res.headers["content-type"]);
        })
        req.end();
        done();
      })
      it('should return an error message', function(done){
        var req = http.request({ path: '/api/v1/tasks', port: 3000, method: 'POST' }, function(res){
          res.setEncoding('utf8');
          res.on('data', function (data) {
            var json = JSON.parse(data);
            assert.equal(json.message, 
                         "Validation failed", 
                         'Expected: Validation failed Actual: ' + json.message);
          });
        })
        req.end();
        done();
      })
    })
  })

  describe('GET /api/v1/tasks/:id', function(){
    describe('for a record that does not exist', function(){
      it('should return at 404 response code', function(done){
        http.get({ path: '/api/v1/tasks/123foobar', port: 3000 }, function(res){
          assert.equal(res.statusCode, 
                       404, 
                       'Expected: 404 Actual: ' + res.statusCode );
          done();
        })
      })
    })
    describe('for a record that does exist', function(){
      var doc = new Task();
      doc.task = 'foo bar';
      beforeEach(function(done){
        doc.save(done);
      })
      it('should return at 200 response code', function(done){
        http.get({ path: '/api/v1/tasks/' + doc.id, port: 3000 }, function(res){
          assert.equal(res.statusCode, 
                       200, 
                       'Expected: 200 Actual: ' + res.statusCode );
          done();
        })
      })
      it('should return JSON', function(done){
        http.get({ path: '/api/v1/tasks/' + doc.id, port: 3000 }, function(res){
          assert.equal(res.headers["content-type"], 
                       "application/json; charset=utf-8", 
                       'Expected: application/json; charset=utf-8 Actual: ' + res.headers["content-type"]);
          done();
        })
      })
    })
  })

  describe('PUT /api/v1/tasks/:id', function(){
    describe('with valid data', function(){
      it('should return at 200 response code')
    })
  })

  describe('DELETE /api/v1/tasks/:id', function(){
    describe('with valid data', function(){
      it('should return at 200 response code')
    })
  })
})
