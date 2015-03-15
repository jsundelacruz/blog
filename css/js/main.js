$(document).ready(function() {
  
  $('body').menuItems({});

  $("#svg_real_logo").hide();

  new Vivus('svg_logo', {type: 'oneByOne', duration: 120});
  setTimeout( function(){
    $("#svg_logo").fadeOut(500);
    $("#svg_real_logo").fadeIn(500);
  }, 2000);

  new Vivus('test', {type: 'oneByOne', duration: 120});

  // $(function() {
  //     var BV = new $.BigVideo();
  //     BV.init();
  //     BV.show('https://player.vimeo.com/video/14352658',{ambient:true});
  // });

});
