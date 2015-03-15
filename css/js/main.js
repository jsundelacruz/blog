$(document).ready(function() {
  
  $('body').menuItems({});

  $("#svg_real_logo").hide();

  new Vivus('svg_logo', {type: 'oneByOne', duration: 160});
  setTimeout( function(){
    $("#svg_logo").fadeOut(500);
    $("#svg_real_logo").fadeIn(500);
  }, 3000);


});

