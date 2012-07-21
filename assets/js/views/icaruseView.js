var PlayerListView = Backbone.View.extend({
  el: $('body'),
  
  events: { 
    'keypress': 'start',
  },
  
  initialize: function(){
    _.bindAll(this, 'start', 'draw', 'fly', 'playerStatus');
    var self = this;
    
    this.icarusCollection = new IcarusCollection(1);    
    
    this.socket = io.connect('http://' + window.location.hostname);
    this.socket.on('other icarus position', function (data) {
      self.draw(data.x, data.y);
    });
    this.socket.on('collision', function(data){
      self.playerStatus(data);
      // self.impactSound.play();
    });

    this.canvas = $('#particles')[0]; 
    this.context = this.canvas.getContext('2d');
    this.context.fillStyle = 'rgba(255,171,64,0.85)';
    this.context.font = '30pt Helvetica';
    this.context.textAligh = 'center';
    this.context.textBaseline = 'center';
    this.context.fillText('Press Any Key to Start Game', self.canvas.width/2-250, self.canvas.height/2);
    this.img = new Image();
    this.img.src = '../../images/kid_icarus.png';
    // this.impactSound = new Audio('../../audios/impact.wav');
    this.backgroundMusic = new Audio('../../audios/SusanFantasticDamage.mp3');
  },
  
  start: function(x, y) {
    this.fly();
    // this.socket.emit('start game');
    this.backgroundMusic.play();
    clearInterval(this.newGameTimer);
  },
  
  draw: function(x, y) {
    this.context.drawImage(this.img, x, y);
  },
  
  fly: function(){   
    var self = this;
    $(window).on('mousemove', function(e) {
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
      
      var sessionId = _.pluck(io.sockets, 'sessionid')[0];
      self.data = {x: x, y: y, sessionId: sessionId};
      self.socket.emit('icarus position', self.data);
      self.draw(x, y);
    });
  },
  
  playerStatus: function(player) {
    var self = this;
    if (player.sessionId === _.pluck(io.sockets, 'sessionid')[0]) {
      $('.bar').attr('style', function() { return "width: " + player.spirit + "%"; });   
    }
    if (player.spirit <= 0 && player.sessionId === _.pluck(io.sockets, 'sessionid')[0])
    {
      $(window).off('mousemove');
      var endGame = function() {
          self.context.clearRect(0, 0, 960, 600);
          self.context.fillStyle = 'rgba(255,171,64,0.85)';
          self.context.font = '40pt Helvetica';
          self.context.textAligh = 'center';
          self.context.textBaseline = 'center';
          self.context.fillText('GAME OVER', self.canvas.width/2-150, self.canvas.height/2);
      }  
      self.newGameTimer = setInterval(endGame, 500);     
    }
  }
});

var playerListView = new PlayerListView();