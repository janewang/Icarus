var PlayerListView = Backbone.View.extend({
  el: $('body'),
  
  events: {
    'mousemove': 'fly'
  },
  
  initialize: function(){
    _.bindAll(this, 'fly', 'draw');
    var _this = this;
    this.icarusCollection = new IcarusCollection(1);

    this.socket = io.connect('http://' + window.location.hostname);
    this.socket.on('other icarus position', function (data) {
      _this.draw(data.x, data.y);
    });
    
    this.canvas = $('#particles')[0]; 
    this.context = this.canvas.getContext('2d');
    this.img = new Image();
    this.img.src = '/images/kid_icarus.png';
  },
  
  draw: function(x, y) {
    this.context.drawImage(this.img, x, y);
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
    this.socket.emit('icarus position', this.position);
    this.draw(x, y);
  }
});

var playerListView = new PlayerListView();