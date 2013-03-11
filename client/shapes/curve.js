// recursively animates the drawing of a curve 
function curve(ctx, parameters, options, callback){
  // if we are at the end of the iteration, finish
  
  if(parameters.parameter >= options.bound){
    if(callback) callback();
    return;
  }

  var start = rotate(options.fn(parameters.parameter), options.direction-Math.PI/2);
  parameters.parameter += options.step;
  var end = rotate(options.fn(parameters.parameter), options.direction-Math.PI/2);

  var startX = options.startX + start[0]*options.size;
  var startY = options.startY - start[1]*options.size;
  var endX = options.startX + end[0]*options.size;
  var endY = options.startY - end[1]*options.size;

  // gradually draw the line segment
  segment(ctx, startX, startY, endX, endY, options.segmentGrowthSpeed, function(){
    // continue the curve by drawing the next segment 
    curve(ctx, parameters, options, callback);
  });
}
