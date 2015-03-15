$(document).ready(function() {
  
  $('body').menuItems({});

  $("#svg_real_logo").hide();

  new Vivus('svg_logo', {type: 'oneByOne', duration: 120});
  setTimeout( function(){
    $("#svg_logo").fadeOut(500);
    $("#svg_real_logo").fadeIn(500);
  }, 2000);


});

