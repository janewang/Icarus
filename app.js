
/**
 * Module dependencies.
 */

var express     = require('express')
  , http        = require('http')
  , sio         = require('socket.io');
  
global._        = require('underscore');
global.request  = require('request');
global.mongoose = require('mongoose');
global.app      = express();

mongoose.connect('localhost', 'icarus');

// Configuration

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.set('version', require('./package').version);
  app.set('name', require('./package').name);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('keyboardcatz'));
  app.use(express.session());
  app.use(app.router);

  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(require('connect-assets')());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(require('connect-assets')({build: true}));
  app.use(express.errorHandler());
});

// include folders
var gameLogic = require('./gameLogic');
require('./routes');
require('./helpers');

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log("%s (%s) on port %d", app.get('name'), app.get('env'), app.get('port'));
});

// -- HOW TO USE DIFFERENT TYPES OF SOCKET EMITS ---
// socket.emit: emit to a specific socket (only to current namespace)
// io.sockets.emit: emit to all connected sockets (to clients in all namespace)
// socket.broadcast.emit: emit to all connected sockets except the one it is being called on (to client in all namespace,
// except the current socket namespace, the current socket will not receive the event) 

var io = sio.listen(server, {log: false});

var icarusApp = new gameLogic.IcarusApp(io);

io.sockets.on('connection', function (socket) {
  
  socket.on('icarus position', function(position){
    socket.broadcast.emit('other icarus position', position);
  });
  
  socket.on('collision', function(data){
    io.sockets.emit('One player has died.');
  });
  
  socket.on('disconnect', function() {
    //io.sockets.emit('Player disconnected.');
    console.log(socket.id + ' disconnected.');
  });
});