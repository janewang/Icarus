var PlayerListView = Backbone.View.extend({
  el: $('body'),
  
  events: {
    'click a#start'     : 'start', 
    'keypress'          : 'start',
  },
  
  initialize: function(){
    _.bindAll(this, 'start', 'draw', 'fly');
    var self = this;
    this.icarusCollection = new IcarusCollection(1);

    this.socket = io.connect('http://' + window.location.hostname);
    this.socket.on('other icarus position', function (data) {
      console.log(data);
      self.draw(data.x, data.y);
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
    var self = this;
    $(window).bind('mousemove', function(e) {
      var x, y;

      switch (true) {
        case (e.pageX < self.canvas.offsetLeft + 25): x = 0; break;
        case (e.pageX - self.canvas.offsetLeft > self.canvas.width - 25): x = self.canvas.width - 25; break;
        default: x = e.pageX - self.canvas.offsetLeft;
      }

      switch (true) {
        case (e.pageY < self.canvas.offsetTop + 33): y = 0; break;
        case (e.pageY - self.canvas.offsetTop > self.canvas.height - 33): y = self.canvas.height - 33; break;
        default: y = e.pageY - self.canvas.offsetTop;
      }
      
      // save mouse's last position
      self.position = {x: x, y: y};
      self.socket.emit('icarus position', self.position);
      self.draw(x, y);   
    });
  } 
});

var playerListView = new PlayerListView();