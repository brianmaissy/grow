// recursively animates the drawing of a line segment
function segment(ctx, startX, startY, endX, endY, speed, callback){

  // calculate the distance to grow
  var distance = Math.sqrt(Math.pow(endX-startX, 2)+Math.pow(endY-startY, 2));

  // if we're already there, finish
  if(distance<1){
    if(callback) callback();
    return;
  }
  
  // otherwise, prepare the line segment
  ctx.beginPath();
  ctx.lineCap = 'square';
  ctx.moveTo(startX, startY);

  // calculate the position of the first step
  var x = startX + (endX-startX)/distance;
  var y = startY + (endY-startY)/distance;

  // draw the line segment
  ctx.lineTo(x, y);
  ctx.stroke();
  setTimeout(function(){
    // draw the remainder of the segment
    segment(ctx, x, y, endX, endY, speed, callback); 
  }, 1000/speed);
}
