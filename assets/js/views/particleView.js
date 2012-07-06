var UniverseView = Backbone.View.extend({
    el: $('body'),
    
    // events: {
    //     'click button#start': 'draw', 
    //     'keypress'          : 'draw'  
    // },
    
    initialize: function(){
      
      // _.bindAll(this, 'draw');
        this.collection = particleCollection;
        this.collection.on('reset', function(){
        var canvas = $('#particles')[0]; 
        var context = canvas.getContext('2d');

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

        // update this universe based on collection
         _.each(particleCollection.models, function(particle) {
           context.beginPath();
           context.arc(particle.attributes.x, particle.attributes.y, 2.5, 0, Math.PI*2, false);
           context.fill();  
         });
      });
    }
});

var universeView = new UniverseView();