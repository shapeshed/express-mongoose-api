var express = require('express')
  , mongoose = require('mongoose');

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

var app = module.exports = express.createServer();

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  mongoose.connect('mongodb://localhost/todo_development');
});

app.configure('test', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  mongoose.connect('mongodb://localhost/todo_test');
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  mongoose.connect('mongodb://localhost/todo_production');
});

app.get('/api/v1/tasks', function(req, res, next){
  Task.find({}, function (err, docs) {
    res.send(docs);
  });
});

app.post('/api/v1/tasks', function(req, res){
  var doc = new Task(req.body.task);
  doc.save(function (err) {
    err ? res.send(err, 422) : res.send(doc);
  });
});

app.get('/api/v1/tasks/:id', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    !doc ? res.send(404) : res.send(doc)
  });
});

app.put('/api/v1/tasks/:id', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    if (!doc) {
      res.send(404)
    } else {
      doc.updated_at = new Date();
      doc.task = req.body.task.task;
      doc.save(function (err) {
        err ? res.send(err, 422) : res.send(doc);
      });
    }
  });
});

app.del('/api/v1/tasks/:id', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    if (!doc) {
      res.send(404)
    } else {
      doc.remove(function() {
        res.send(200)
      });
    }
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
