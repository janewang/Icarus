var PlayerListView = Backbone.View.extend({
  el: $('body'),
  
  events: {
    'click a#start'     : 'start', 
    'keypress'          : 'start',
  },
  
  initialize: function(){
    _.bindAll(this, 'start', 'draw', 'fly');
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
  
  start: function(x, y) {
    this.fly();
  },
  
  draw: function(x, y) {
    this.context.drawImage(this.img, x, y);
  },
  
  fly: function(){
    var _this = this;
    $(window).bind('mousemove', function(e) {
      var x, y;

      switch (true) {
        case (e.pageX < _this.canvas.offsetLeft + 25): x = 0; break;
        case (e.pageX - _this.canvas.offsetLeft > _this.canvas.width - 25): x = _this.canvas.width - 25; break;
        default: x = e.pageX - _this.canvas.offsetLeft;
      }

      switch (true) {
        case (e.pageY < _this.canvas.offsetTop + 33): y = 0; break;
        case (e.pageY - _this.canvas.offsetTop > _this.canvas.height - 33): y = _this.canvas.height - 33; break;
        default: y = e.pageY - _this.canvas.offsetTop;
      }
      
      // save mouse last move
      _this.position = {x: x, y: y};
      _this.socket.emit('icarus position', this.position);
      _this.draw(x, y);   
    });
  } 
});

var playerListView = new PlayerListView();