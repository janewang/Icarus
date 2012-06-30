var Icarus = function(canvas) {
  var img = new Image();
  img.src = '/images/kid_icarus.png';
  this.context = canvas.getContext('2d'); 
  
  this.draw = function() {
    if (this.position === undefined || this.position === null) return;
    var speed_limit = 4;
    
    this.context.drawImage(img, this.position.x, this.position.y);

  }
}

function fly() {
  var canvas = $('#particles')[0];
  var a = new Icarus(canvas);
  $('#particles').data('icarus', a);

  // mouse input
  $(window).on('mousemove', function(e){
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
    a.position = {x: x, y: y};
  });
  

}