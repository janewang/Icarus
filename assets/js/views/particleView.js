var UniverseView = Backbone.View.extend({
    el: $('body'),
    
    events: {
        'click a#start'     : 'start', 
        'keypress'          : 'start'  
    },
    
    initialize: function() {
      _.bindAll(this, 'start');
      this.canvas = $('#particles')[0]; 
      this.context = this.canvas.getContext('2d');
      
      this.particleCollection = new ParticleCollection();
      var _this = this;

      var socket = io.connect('http://' +   window.location.hostname);
      socket.on('particle position', function (data) {
        _this.particleCollection.reset(data);
      });
    },

    start: function() {
      var _this = this;
      this.particleCollection.on('reset', function() {

        // fading
        _this.context.globalCompositeOperation = 'source-in';
        _this.context.fillStyle = "rgba("+
          Math.floor(Math.random()*256)+","+
          Math.floor(Math.random()*256)+","+
          Math.floor(Math.random()*256)+",0.85)";
        _this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);

        // dot drawing style
        _this.context.globalCompositeOperation = 'lighter';
        _this.context.fillStyle = 'rgba(255,255,255,0.85)';

        // update this universe based on collection
         _.each(_this.particleCollection.models, function(particle) {
           _this.context.beginPath();
           _this.context.arc(particle.get('x'), particle.get('y'), 2.5, 0, Math.PI*2, false);
           _this.context.fill();  
         });
      });
      console.log('started');
    }
});

var universeView = new UniverseView();