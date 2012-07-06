var sio = require('socket.io');

// Icarus model
var Icarus = function(x, y){
  this.x = x;
  this.y = y;
  
  this.update = function() {
    // allow this icarus to be updated by mouse movements
  }
  
  this.die = function() {
    // this icarus dies
  }
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
    // initializing variables
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
          // for each collision stop the icarus
          // kill the icarus Icarus.die();
      });
}

var IcarusApp = function(io) {
  
  this.particles = [];
  _(100).times(_.bind(function() { this.particles.push(new Particle()); }, this));
  
  var _this = this;
  
  // update particle collection
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
  
  // nbody code acceleration accumulation
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

exports.IcarusApp = IcarusApp;