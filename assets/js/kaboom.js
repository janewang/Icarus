function kaboom() {
  var ix, iy;

  // border limit
  $(window).bind('mousemove', function(e){
    switch (true) {
      case (e.pageX < canvas.offsetLeft + 25): ix = 0; break;
      case (e.pageX - canvas.offsetLeft > canvas.width - 25): ix = canvas.width - 25; break;
      default: ix = e.pageX - canvas.offsetLeft;
    }

    switch (true) {
      case (e.pageY < canvas.offsetTop + 33): iy = 0; break;
      case (e.pageY - canvas.offsetTop > canvas.height - 33): iy = canvas.height - 33; break;
      default: iy = e.pageY - canvas.offsetTop;
    }
  });
}