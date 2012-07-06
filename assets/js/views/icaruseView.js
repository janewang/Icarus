var PlayerListView = Backbone.View.extend({
  el: $('body'),
  
  events: {
    'mousemove': 'fly'
  },
  
  initialize: function(){
    _.bindAll(this, 'fly', 'draw');
    
    this.icarusCollection = new IcarusCollection(1);

    this.socket = io.connect('http://'+window.location.hostname);
    this.socket.on('player position', function (data) {
      console.log(data);
    });
  
    this.canvas = $('#particles')[0]; 
    this.context = this.canvas.getContext('2d');
    this.img = new Image();
    this.img.src = '/images/kid_icarus.png';
  },
  
  draw: function() {
    if (this.position === undefined || this.position === null) return;
    this.socket.emit('icarus position', this.position);   
    this.context.drawImage(this.img, this.position.x, this.position.y);
  },
  
  fly: function(e){
    var x, y;
    
    switch (true) {
      case (e.pageX < this.canvas.offsetLeft + 25): x = 0; break;
      case (e.pageX - this.canvas.offsetLeft > this.canvas.width - 25): x = this.canvas.width - 25; break;
      default: x = e.pageX - this.canvas.offsetLeft;
    }

    switch (true) {
      case (e.pageY < this.canvas.offsetTop + 33): y = 0; break;
      case (e.pageY - this.canvas.offsetTop > this.canvas.height - 33): y = this.canvas.height - 33; break;
      default: y = e.pageY - this.canvas.offsetTop;
    }
    
    // save mouse last move
    this.position = {x: x, y: y};

    this.draw();
  }
});

var playerListView = new PlayerListView();