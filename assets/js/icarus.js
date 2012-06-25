function draw(x, y) {
  var ctx = $('#particles')[0].getContext('2d');
  var img = new Image();
  img.src = '/images/kid_icarus.png';
  img.onload = function(){
    ctx.drawImage(img,x,y);
  }
}
    
function fly() {
   $('#particles').bind('mousemove', function(e){
    var x, y;
    if (e.pageX || e.pageY) {
      x = e.pageX - this.offsetLeft;
      y = e.pageY - this.offsetTop;
    }
    else {
      x = Math.random()*canvas.width;
      y = Math.random()*canvas.height;
    }
    draw(x,y);
  });
}