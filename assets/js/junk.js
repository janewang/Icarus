// old universe.js client side universe - deprecated

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
            
var Particle = function(canvas){
    var initial_speed = 1;
    var speed_limit = 4;
    var bounce_damping = 0.5;
    
    this.acceleration = new Vector(0, 0);
    this.velocity = new Vector(
        Math.random() * initial_speed - initial_speed * 0.5,
        Math.random() * initial_speed - initial_speed * 0.5
    );
    this.position = new Vector(
        Math.random() * canvas.width,
        Math.random() * canvas.height
        
    );

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
        else if(this.position.x > canvas.width){
            this.position.x = canvas.width;
            this.velocity.x *= -bounce_damping;
        }

        if(this.position.y < 0){
            this.position.y = 0;
            this.velocity.y *= -bounce_damping;
        }
        else if(this.position.y > canvas.height){
            this.position.y = canvas.height;
            this.velocity.y *= -bounce_damping;
        }

    }
    this.draw = function(context){
        context.beginPath();
        context.arc(this.position.x, this.position.y, 2.5, 0, Math.PI*2, false);
        context.fill();
    }
    
    this.end = function(context) {
        var count = 0;
        var endGame = function() {
            count++;
            if (count % 2 == 1)  {
                context.clearRect(150, 240, 500, 200);
                context.fillStyle = "rgba(0,255,0,0.85)";
                context.font = '60pt Arial';
                context.textAlign = 'center';
                context.textBaseline = 'center';
                context.fillText('GAME OVER', canvas.width/2, canvas.height/2);
            } 
            else { 
                context.clearRect(150, 240, 500, 200);
                context.fillStyle = 'rgba(0,255,0,0.85)';
                context.font = '30pt Arial';
                context.textAligh = 'center';
                context.textBaseline = 'center';
                context.fillText('To play again, press enter.', canvas.width/2, canvas.height/2);
            }
        }
        
        var timer = setInterval(endGame, 300);
        
        // replay
        $(window).on('keydown', function(e){
          if (e.keyCode === 13) {
            clearInterval(timer);
          }
        });  
    }
}

var System = function(amount, milliseconds){
    var factor = 9;
    var min_proximity = 4;

    var canvas = $('#particles')[0];
    var context = canvas.getContext('2d');
        
    var particles = [];
    _(amount).times(function(){ particles.push(new Particle(canvas)); });
    
    
    var ix, iy;
    var listen = function() {
      
      $(window).bind('mousemove', function(e){
        switch (true) {
          case (e.pageX < canvas.offsetLeft + 25): ix = 0; break;
          case (e.pageX - canvas.offsetLeft > canvas.width - 25): ix = canvas.width - 25; break;
          default: ix = e.pageX - canvas.offsetLeft;
        }

        switch (true) {
          case (e.pageY < canvas.offsetTop + 33): iy = 0; break;
          case (e.pageY - canvas.offsetTop > canvas.height - 33): iy = canvas.height - 33; break;
          default: iy = e.pageY - canvas.offsetTop;
        }
      });
    }
    
    listen();
    
    var refresh = function(){
        // fading
        context.globalCompositeOperation = 'source-in';        
        context.fillStyle = "rgba("+
          Math.floor(Math.random()*256)+","+
          Math.floor(Math.random()*256)+","+
          Math.floor(Math.random()*256)+",0.85)";   
        context.fillRect(0, 0, canvas.width, canvas.height);

        // dot drawing style
        context.globalCompositeOperation = 'lighter';
        context.fillStyle = 'rgba(255,255,255,0.85)';

        // nbody code acceleration accumulation
        _(particles).each(function(a, idx){
          var rest = _.rest(particles, idx);
          _(rest).each(function(b){
            var vec = a.position.sub(b.position);
            var length = vec.length();
            vec.idiv(Math.pow(length, 3)/factor); // scale the vector to the inverse square distance

            // safeguard for execessive integration error
            if(length > min_proximity){
                b.acceleration.iadd(vec);
                a.acceleration.isub(vec);
            }
          });
          a.step();
          a.draw(context);
        });
        var icarus = $('#particles').data('icarus');
        if (icarus !== undefined && icarus !== null) $('#particles').data('icarus').draw();
      
        _.chain(particles)
            .filter(function(a) {
                return ( Math.abs(a.position.x - ix) < 6 && (Math.abs(a.position.y - iy) < 6));
            })
            .each(function(a){
                a.end(context);
                $(window).off('mousemove');
                clearInterval(timer);
            });
        
    };
    var timer = setInterval(refresh, milliseconds);
}

// start game with button click
var main = function(){
    var system = new System(100, 20); // number of objects, speed
    fly();
}

// start game with enter key
var enter = function(){
  
  $(window).on('keydown', function(e){
    if(e.keyCode === 13) {
      var canvas = $('#particles')[0];
      var context = canvas.getContext('2d'); 
      context.clearRect(0, 0, canvas.width, canvas.height);
      var system = new System(100, 20);
      fly();
    }
  });  
}

enter();

// old icarus.js

var Icarus = function(canvas) {
  var img = new Image();
  var self = this;
  img.src = '/images/kid_icarus.png';
  this.context = canvas.getContext('2d'); 
  this.socket = io.connect('http://localhost');
  
  this.socket.on('player position', function (position) {
    self.context.drawImage(img, position.x, position.y);
  });
  
  this.draw = function() {
    if (this.position === undefined || this.position === null) return;
    this.socket.emit('position', this.position);   
    this.context.drawImage(img, this.position.x, this.position.y);
  }
}

function fly() {
  var canvas = $('#particles')[0];
  var a = new Icarus(canvas);
  $('#particles').data('icarus', a);

  // mouse input
  $(window).on('mousemove', function(e){
    var x, y;
    switch (true) {
      case (e.pageX < canvas.offsetLeft + 25): x = 0; break;
      case (e.pageX - canvas.offsetLeft > canvas.width - 25): x = canvas.width - 25; break;
      default: x = e.pageX - canvas.offsetLeft;
    }

    switch (true) {
      case (e.pageY < canvas.offsetTop + 33): y = 0; break;
      case (e.pageY - canvas.offsetTop > canvas.height - 33): y = canvas.height - 33; break;
      default: y = e.pageY - canvas.offsetTop;
    }
    a.position = {x: x, y: y};
  });
  
  // keyboard input
  $(window).on('onkeydown', function(e){
    var e = window.event() || e;
    var keyunicode = e.keyCode;
    console.log(e);
    switch (keyunicode) {
      case 38: console.log(e.pageX); 
      case 40: console.log(e.pageX);
      case 37: // left
      case 39: // right
    }
  });

}



exports.Vector = function(x, y){
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
            
exports.Particle = function(canvas){
  
    var initial_speed = 1;
    var speed_limit = 4;
    var bounce_damping = 0.5;
    
    this.acceleration = new Vector(0, 0);
    this.velocity = new Vector(
        Math.random() * initial_speed - initial_speed * 0.5,
        Math.random() * initial_speed - initial_speed * 0.5
    );
    this.position = new Vector(
        Math.random() * canvas.width,
        Math.random() * canvas.height
    );

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
        else if(this.position.x > canvas.width){
            this.position.x = canvas.width;
            this.velocity.x *= -bounce_damping;
        }

        if(this.position.y < 0){
            this.position.y = 0;
            this.velocity.y *= -bounce_damping;
        }
        else if(this.position.y > canvas.height){
            this.position.y = canvas.height;
            this.velocity.y *= -bounce_damping;
        }

    }

   if (this.position === undefined || this.position === null) return;
        this.socket.emit('universe', this.position);
        // context.beginPath();
        // context.arc(this.position.x, this.position.y, 2.5, 0, Math.PI*2, false);
        // context.fill();      
    }
}

exports.System = function(amount, milliseconds){
    var factor = 9;
    var min_proximity = 4;
        
    var particles = [];
    _(amount).times(function(){ particles.push(new Particle(canvas)); });
    
    
    // server
    var socket = io.connect('http://localhost');
  
    var refresh = function(){    
      
        // fading
        context.globalCompositeOperation = 'source-in';        
        context.fillStyle = "rgba("+
          Math.floor(Math.random()*256)+","+
          Math.floor(Math.random()*256)+","+
          Math.floor(Math.random()*256)+",0.85)";   
        context.fillRect(0, 0, canvas.width, canvas.height);

        // dot drawing style
        context.globalCompositeOperation = 'lighter';
        context.fillStyle = 'rgba(255,255,255,0.85)';

        // nbody code acceleration accumulation
        _(particles).each(function(a, idx){
          var rest = _.rest(particles, idx);
          _(rest).each(function(b){
            var vec = a.position.sub(b.position);
            var length = vec.length();
            vec.idiv(Math.pow(length, 3)/factor); // scale the vector to the inverse square distance

            // safeguard for execessive integration error
            if(length > min_proximity){
                b.acceleration.iadd(vec);
                a.acceleration.isub(vec);
            }
          });
          a.step();
          
          // socket broadcast instead of draw
          socket.on('universe', function(position){
              context.beginPath();
              context.arc(this.position.x, this.position.y, 2.5, 0, Math.PI*2, false);
              context.fill();
          });
          
          // a.draw(context);
        });
      
        _.chain(particles)
            .filter(function(a) {
                return ( Math.abs(a.position.x - ix) < 6 && (Math.abs(a.position.y - iy) < 6));
            })
            .each(function(a){
                a.end(context);
                clearInterval(timer);
            });
        
    };
    var timer = setInterval(refresh, milliseconds);
}

// // start game with button click
// var main = function(){
//     var system = new System(100, 20); // number of objects, speed
//     fly();
// }


// client side
// need some initialization function

// var window.IcarusApp = {
//   models: {'Icarus'},
//   collections: {'IcarusCollection'},
//   config: {}
// }
// 
// _(IcarusApp).extend(Backbone.Events);
