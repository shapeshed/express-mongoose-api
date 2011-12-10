
var http = require('http');
var app = require('../app.js');

describe('http', function(){
  it('should provide an example', function(done){
    http.get({ path: '/api/v1/tasks', port: 3000 }, function(res){
      console.log(res.body);
      done();
    })
  })
})
