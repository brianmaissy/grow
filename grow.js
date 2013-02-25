if (Meteor.isClient) {
  var canvas, ctx;
  
  var spread = Math.PI/3;
  var colorJump = 32;
  var timeDelay = 150;

  var a = .85, b = .92, c = 1, d = 2;
  var shrink = function(n){
    if(n<d) return 0;
    return a*Math.pow(n, b)-c;
  }

  function init(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.lineCap='butt';
    newFractal();
  }

  function newFractal(){
    fractal(200.5, 399.5, Math.PI/2, 100, 0, true, function(){
      ctx.clearRect(0, 0, 400, 400);
      setTimeout(function(){
        newFractal(); 
      }, timeDelay);
    });
  }

  function fractal(x, y, dir, length, color, leftmost, callback){
    if(length == 0){
      if(leftmost) callback();
      return;
    }

    var dilution = color.toString(16);
    if(dilution.length < 2) dilution = '0' + dilution;

    ctx.strokeStyle='#' + dilution + dilution + 'ff'; 
    ctx.beginPath();
    ctx.moveTo(x, y);
    x+=length*Math.cos(dir);
    y-=length*Math.sin(dir);
    ctx.lineTo(x, y);
    ctx.stroke();

    setTimeout(function(){
      fractal(x, y, dir+spread, shrink(length), color+colorJump, leftmost, callback);
      fractal(x, y, dir-spread, shrink(length), color+colorJump, false, callback);
    }, timeDelay);
  }

  window.onload = init;
}
