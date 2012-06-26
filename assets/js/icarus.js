var Icarus = function(canvas) {
  var img = new Image();
  img.src = '/images/kid_icarus.png';
  this.context = canvas.getContext('2d'); 

  this.draw = function(x, y) {
    this.context.drawImage(img, x, y);
  }
  
  this.end = function() {
    this.context.fillStyle = 'rgba(255,0,0,0.85)';
    this.context.font = '40pt Helvetica';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'center';
    this.context.fillText('GAME OVER', canvas.width/2, canvas.height/2);
  }
}

function fly() {
  var canvas = $('#particles')[0];
  var a = new Icarus(canvas);

  // border limit
  $(window).bind('mousemove', function(e){
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

    a.draw(x,y);
    // a.end();
  });
}