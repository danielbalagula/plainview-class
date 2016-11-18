var config = require('./config');

var express = require('express');
var app = express();
var socket_io = require( "socket.io" );
var io = socket_io();
app.io = io;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var api = require('./routes/api');
var users = require('./routes/users');
var discussions = require('./routes/discussions');
var responses = require('./routes/responses');
var tags = require('./routes/tags');

var Response = require('./models/response');

discussionClients = {};

var dbconf;

if (process.env.NODE_ENV == 'PRODUCTION') {
 var fs = require('fs');
 var fn = path.join(__dirname, 'config.json');
 var data = fs.readFileSync(fn);

 var conf = JSON.parse(data);
 var dbconf = conf.dbconf;
} else {

 dbconf = 'mongodb://localhost/db2791';
}

mongoose.connect(dbconf);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('socketio', io);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', api);
app.use('(/api)?/users', users);
app.use('(/api)?/discussions', discussions);
app.use('(/api)?/responses', responses);
app.use('(/api)?/tags', tags);

app.get('/about', function(req, res, next){
  res.render('about', {});
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  // app.use(function(err, req, res, next) {
  //   res.status(err.status || 500);
  //   res.render('error', {
  //     message: err.message,
  //     error: err
  //   });
  // });
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    var status404;
    console.log(err.status)
    if (err.status == 404){
      status404 = true;
    }
    res.render('error', {
      message: err.message,
      status404: status404
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var status404;
  console.log(err.status)
  if (err.status == 404){
    console.log('hi')
    status404 = true;
  }
  res.render('error', {
    message: err.message,
    status404: status404
  });
});

io.on( "connection", function( socket ) {
  socket.on("viewingDiscussion", function(id){
    if (discussionClients[id] === undefined){
      discussionClients[id] = [socket.id];
    } else {
      discussionClients[id].push(socket.id);
    }
  })
});


module.exports = app;
