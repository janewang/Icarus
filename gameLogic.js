var application = require('./app');
var io = application.io;

// -- HOW TO USE DIFFERENT TYPES OF SOCKET EMITS ---
// socket.emit: emit to a specific socket (only to current namespace)
// io.sockets.emit: emit to all connected sockets (to clients in all namespace)
// socket.broadcast.emit: emit to all connected sockets except the one it is being called on (to client in all namespace,
// except the current socket namespace, the current socket will not receive the event)

io.sockets.on('connection', function (socket) {
  console.log(socket.id);
  
  socket.on('icarus position', function(position){
    socket.broadcast.emit('other icarus position', position);
  });
  
  socket.on('collision', function(data){
    io.sockets.emit('One player has died.');
  });
  
  socket.on('disconnect', function() {
    //io.sockets.emit('Player disconnected.');
    console.log('Player ' + socket.id + ' disconnected.');
  });
});

// Icarus model
var Icarus = function(x, y, username, sessionId){
  this.x = x;
  this.y = y;
  this.username = username;
  this.sessionId = sessionId;
}

// vector model
var Vector = function(x, y){
    this.x = x;
    this.y = y;

    this.sub = function(other){
        return new Vector(
          this.x - other.x,
          this.y - other.y
        );
    }
    this.isub = function(other){
      this.x = this.x;
      this.y = this.y;
      // on gravity
      // this.x -= other.x;
      // this.y -= other.y;
    }
    this.iadd = function(other){
        this.x += other.x;
        this.y += other.y;
    }
    this.length = function(){
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    this.idiv = function(scalar){
        this.x /= scalar;
        this.y /= scalar;
    }
    this.zero = function(){
        this.x = 0;
        this.y = 0;
    }
    this.validate = function(){
        if(isNaN(this.x+this.y)){
            this.x = 0;
            this.y = 0;
        }
    }
}

// particle model
var Particle = function(){

    var width = 800, height = 600;    
    var initial_speed = 1;
    var speed_limit = 4;
    var bounce_damping = 0.5;
    
    this.position = new Vector(
        Math.random() * width,
        Math.random() * height 
    );
    
    this.velocity = new Vector(
        ( Math.random() - 0.5 ) * initial_speed,
        ( Math.random() - 0.5 ) * initial_speed
    );
    
    this.acceleration = new Vector(0, 0);

    this.step = function(){
        this.acceleration.validate();
        this.velocity.iadd(this.acceleration);
       
        speed = this.velocity.length();
        if(speed > speed_limit){
            this.velocity.idiv(speed/speed_limit);
        }
        this.position.iadd(this.velocity);
        this.acceleration.zero();

        // border bounce
        if(this.position.x < 0){
            this.position.x = 0;
            this.velocity.x *= -bounce_damping;
        }
        else if(this.position.x > width){
            this.position.x = width;
            this.velocity.x *= -bounce_damping;
        }

        if(this.position.y < 0){
            this.position.y = 0;
            this.velocity.y *= -bounce_damping;
        }
        else if(this.position.y > height){
            this.position.y = height;
            this.velocity.y *= -bounce_damping;
        }
    }
}

// check for collision
function collision() {
  _.chain(particles)
      .filter(function(a) {
          return ( Math.abs(a.position.x - ix) < 6 && (Math.abs(a.position.y - iy) < 6));
      })
      .each(function(a){
          io.sockets.emit('collision', data); // need to include sessionid to know which client is died
      });
}

var IcarusApp = function(io) {
  
  this.particles = [];
  _(100).times(_.bind(function() { this.particles.push(new Particle()); }, this));
  
  this.playerList = [];
  //console.log(io.sockets);
  //console.log(io.sockets.manager);
  //var clients = io.sockets.clients();
  //_(clients.length).times(_.bind(function(){ this.playerList.push(new Icarus()); }, this));
  
  var _this = this;
  
  var timer = setInterval(function() {
    _this.update();
    io.sockets.emit('particle position', _.pluck(_this.particles, 'position'));
  }, 50);
  
  //clearInterval(timer);
}

IcarusApp.prototype.update = function() {
  
  var factor = 9;
  var min_proximity = 4;
  var _this = this;
  
  _(this.particles).each(function(a, idx) {
    var rest = _.rest(_this.particles, idx);
    _(rest).each(function(b) {
      var vec = a.position.sub(b.position);
      var length = vec.length();
      vec.idiv(Math.pow(length, 3)/factor); // scale the vector to the inverse square distance

      // safeguard for execessive integration error
      if(length > min_proximity) {
          b.acceleration.iadd(vec);
          a.acceleration.isub(vec);
      }
    });
    a.step();
  }); 
}

var icarusApp = new IcarusApp(io);