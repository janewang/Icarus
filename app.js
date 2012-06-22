
/**
 * Module dependencies.
 */

var express     = require('express')
  , http        = require('http')
  , sio          = require('socket.io');
  
global._        = require('underscore');
global.request  = require('request');
global.mongoose = require('mongoose');
global.app      = express();

mongoose.connect('localhost', 'icarus');

// Configuration

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
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
require('./routes');
require('./helpers');

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log("%s (%s) on port %d", app.get('name'), app.get('env'), app.get('port'));
});



// Socket.IO server (single process only)

var io = sio.listen(server),
  nickname = {};
  
io.sockets.on('connection', function (sockets) {
  socket.on('user message', function (msg) {
    socket.broadcast.emit('user message', socket.nickname, msg);
  });
  
  socket.on('nickname', function (nick, fn) {
    if (nicknames[nick]) {
      fn(true);
    } else {
      fn(false);
      nicknames[nick]
    }
  })
  
  
})


// io.sockets.on('connection', function (socket) {
//   socket.on('user message', function (msg) {
//     socket.broadcast.emit('user message', socket.nickname, msg);
//   });
// 
//   socket.on('nickname', function (nick, fn) {
//     if (nicknames[nick]) {
//       fn(true);
//     } else {
//       fn(false);
//       nicknames[nick] = socket.nickname = nick;
//       socket.broadcast.emit('announcement', nick + ' connected');
//       io.sockets.emit('nicknames', nicknames);
//     }
//   });
// 
//   socket.on('disconnect', function () {
//     if (!socket.nickname) return;
// 
//     delete nicknames[socket.nickname];
//     socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
//     socket.broadcast.emit('nicknames', nicknames);
//   });
// });
// 
// 
// 
// 
// io.configure(function() {
//   io.set('transports', ['xhr-polling']);
//   io.set('polling duration', 10);
// });
// 
// io.sockets.on('connection', function(socket) {
//   socket.emit('news', { hello: 'world' });
//   
//   socket.on('private message', function (from, msg) {
//     console.log('I received a private message.');
//   });
//   
//   socket.on('disconnect', function(){
//     io.socket.emit('user disconnected');
//   });
// });
// 
