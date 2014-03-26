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
  // evaluate the parameters
  var params = evaluateThunks(clone(originalParams))

  // base case: stop drawing if the segment is over for practical purposes (less than half a pixel)
  if(params.size < 0.5){
    finish(callback, params);
    return;
  }
  
  // prepare the line segment
  canvas.strokeStyle = params.color;
  canvas.beginPath();
  canvas.lineCap = 'round';
  canvas.moveTo(params.x, params.y);

  // calculate the position of the next step
  var destination = rotate([1, 0], params.direction)
  params.x += destination[0];
  params.y += destination[1];
  params.size -= 1;

  // draw the line segment
  canvas.lineTo(params.x, params.y);
  canvas.stroke();

  waitAndCall(1000/params.speed, function(){
    segment(canvas, params, callback);
  });
}
