
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todo');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

function validatePresenceOf(value) {
  return value && value.length;
}

var Task = new Schema({
  task : { type: String, validate: [validatePresenceOf, 'a task is required'] },
  created_at : Date,
  updated_at : Date
});

var Task = mongoose.model('Task', Task);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/api/v1/tasks', function(req, res, next){
  Task.find({}, function (err, docs) {
    res.send(docs);
  });
});

// Create
app.post('/api/v1/tasks', function(req, res){
  var doc = new Task(req.body.task);
  doc.created_at = new Date();
  // TODO validation
  doc.save(function (err) {
    if (!err) {
      res.send(doc)
    }
    else {
      res.send(err)
    }
  });
});

// Read
app.get('/api/v1/tasks/:id', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    if (doc) {
      if (!err){
        res.send(doc)
      }
      else {
        // error handling
      }
    }
    else {
      res.send(404)
    }
  });
});

// Update
app.put('/api/v1/tasks/:id', function(req, res){
  Task.findById(req.params.id, function (err, doc){
    // TODO handle no record found
    doc.updated_at = new Date();
    doc.task = req.body.task.task;
    doc.save(function(err) {
      if (!err){
        res.send(200)
      }
      else {
        // error handling
      }
    });
  });
});

// Delete
app.del('/api/v1/tasks/:id', function(req, res){
  Task.findOne({ _id: req.params.id }, function(err, doc) {
    // TODO handle no record found
    if (!doc) return next(new NotFound('Document not found'));
    doc.remove(function() {
      res.send(200)
    });
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
