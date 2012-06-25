var Icarus = function(canvas) {
  var context = canvas.getContext('2d'); 
  var img = new Image();
  img.src = '/images/kid_icarus.png';

  this.draw = function(x, y) {
    img.onload = function(){
      context.drawImage(img,x,y);
    }
  } 
}

function fly() {
  var canvas = $('#particles')[0];

  // border limit
  $(window).bind('mousemove', function(e){
    var x, y;
    if(e.pageX < canvas.offsetLeft + 25) {
      x = 0;
    } else if(e.pageX - canvas.offsetLeft > canvas.width - 25) {
      x = canvas.width - 25;
    } else{
      x = e.pageX - canvas.offsetLeft;
    }

    if(e.pageY < canvas.offsetTop + 33) {
      y = 0;
    } else if(e.pageY - canvas.offsetTop > canvas.height - 33) {
      y = canvas.height - 33;
    } else{
      y = e.pageY - canvas.offsetTop;
    }

    var a = new Icarus(canvas);
    a.draw(x,y);
  });
}