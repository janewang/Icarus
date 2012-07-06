var PlayerListView = Backbone.View.extend({
  el: $('body'),
  
  events: {
    'mousemove': 'fly'
  },
  
  initialize: function(){
    //_.bindAll(this, 'fly', 'draw');
    this.collection = icarusCollection;
  
    var canvas = $('#particles')[0]; 
    var context = canvas.getContext('2d');
    var img = new Image();
    img.src = '/images/kid_icarus.png';
    

    $(window).on('mousemove', function(e){
      var x, y;
      var canvas = $('#particles')[0]; 
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
      //a.position = {x: x, y: y};
      console.log('x is ' + x + ' and y is ' + y);
      context.drawImage(img, x, y);
    });
  },
  
  draw: function() {
    this.canvas = $('#particles')[0]; 
    this.context = canvas.getContext('2d');
    
    var img = new Image();
    img.src = '/images/kid_icarus.png';
    
    if (this.position === undefined || this.position === null) return;
    this.socket.emit('position', this.position);   
    this.context.drawImage(img, this.position.x, this.position.y);
  },
  
  fly: function(e){
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
    
    // save mouse last move
    this.position = {x: x, y: y};

    draw();
  }
});

var playerListView = new PlayerListView();