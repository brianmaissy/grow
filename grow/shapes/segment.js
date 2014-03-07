/* 

Draws a line segment asynchronously.

Params:
    x (starting x-coordinate)
    y (starting y-coordinate)
    direction (direction to draw in radians)
    size (line segment length in pixels)
    speed (the rate at which to draw, in pixels per second)
    color (the color of the segment, in hex)

Callback:
    Called when the line is fully drawn. Passes the final params object.

*/

function segment(canvas, originalParams, callback){
  var params = evaluateThunks(clone(originalParams))

  // if we're already there, finish
  if(params.size < 1){
    // return the final params so we know where we left off
    if(callback) callback(params);
    return;
  }
  
  // prepare the line segment
  canvas.strokeStyle = params.color;
  canvas.beginPath();
  canvas.lineCap = 'round';
  canvas.moveTo(params.x, params.y);

  // calculate the position of the next step
  var destination = rotate([1, 0], params.direction)
  var destinationX = params.x + destination[0];
  var destinationY = params.y - destination[1];

  // draw the line segment
  canvas.lineTo(destinationX, destinationY);
  canvas.stroke();

  setTimeout(function(){
    // draw the remainder of the segment
    segment(canvas, modify(originalParams, {
      size: params.size-1,
      x: destinationX,
      y: destinationY,
    }), function(endingParams){ callback(endingParams); }); 
  }, 1000/params.speed);
}
