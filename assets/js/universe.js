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
}

var System = function(amount, milliseconds){
    var factor = 9;
    var min_proximity = 4;

    var canvas = $('#particles')[0];
    var context = canvas.getContext('2d');
        
    var particles = [];
    _(amount).times(function(){ particles.push(new Particle(canvas)); });
       
    var refresh = function(){
        // fading
        context.globalCompositeOperation = 'source-in';
        context.fillStyle = 'rgba(255,255,255,0.85)';
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
        setTimeout(refresh, milliseconds);
    };
    setTimeout(refresh, milliseconds); // safer code
}

var main = function(){
    var system = new System(100, 20); // number of objects, speed
};