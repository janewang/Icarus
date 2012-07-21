var UniverseView = Backbone.View.extend({
    el: $('body'),
    
    events: {
        'keypress'  : 'start'  
    },
    
    initialize: function() {
      _.bindAll(this, 'start');
      this.canvas = $('#particles')[0]; 
      this.context = this.canvas.getContext('2d');
      this.spirit = 100;
      
      this.particleCollection = new ParticleCollection();
      var self = this;

      this.socket = io.connect('http://' +   window.location.hostname);
      
      this.socket.on('collision', function(data){
        if (data.sessionId === _.pluck(io.sockets, 'sessionid')[0]) {
          this.spirit = data.spirit;
        }
      });
      
      // only render universe when this icarus is still alive
      this.socket.on('particle position', function (data) {
        if (this.spirit > 0) {
          self.particleCollection.reset(data);
        }   
      });
    },

    start: function() {
      var self = this;
      this.particleCollection.on('reset', function() {

        // fading
        self.context.globalCompositeOperation = 'source-in';
        self.context.fillStyle = "rgba("+
          Math.floor(Math.random()*256)+","+
          Math.floor(Math.random()*256)+","+
          Math.floor(Math.random()*256)+",0.85)";
        self.context.fillRect(0, 0, self.canvas.width, self.canvas.height);

        // dot drawing style
        self.context.globalCompositeOperation = 'lighter';
        self.context.fillStyle = 'rgba(255,255,255,0.85)';

        // update this universe based on collection
         _.each(self.particleCollection.models, function(particle) {
           self.context.beginPath();
           self.context.arc(particle.get('x'), particle.get('y'), 2.5, 0, Math.PI*2, false);
           self.context.fill();  
         });
      });
    }
});

var universeView = new UniverseView();