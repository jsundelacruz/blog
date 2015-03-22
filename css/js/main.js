$(document).ready(function() {
  
  $('body').menuItems({});

  $("#svg_real_logo").hide();

  new Vivus('svg_logo', {type: 'oneByOne', duration: 120});
  setTimeout( function(){
    $("#svg_logo").fadeOut(500);
    $("#svg_real_logo").fadeIn(500);
  }, 3000);


  setInterval(function(){ 
    $("#down-arrow").fadeOut(300) ;
  }, 2000);

  setInterval(function(){ 
    $("#down-arrow").fadeIn(300) ;
  }, 2000);

});
