$(function(){
  var path = location.pathname
  $('ul.nav li').removeClass()
  $('ul.nav li a[href="' + path + '"]').parent().addClass('active');
})