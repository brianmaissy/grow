// recursively animates the drawing of a fractal
function fractal(ctx, parameters, options, callback){

  // if we are at the end of the iteration, finish
  if(parameters.size === 0){
    if(callback) callback();
    return;
  }

  // set the color based on the tint
  ctx.strokeStyle = tintColor(options.color, parameters.tint);

  // store the starting point
  var startX = parameters.x;
  var startY = parameters.y;

  // generate the next set of parameters
  parameters = modify(parameters, {
    x: parameters.x + parameters.size * Math.cos(parameters.direction),
    y: parameters.y - parameters.size * Math.sin(parameters.direction),
    size: options.shrink(parameters.size),
    tint: parameters.tint + options.tintInterval
  });

  // gradually draw the line segment
  segment(ctx, startX, startY, parameters.x, parameters.y, options.segmentGrowthSpeed, function(){
    // set the timeout for the next iterations
    setTimeout(function(){
      // only pass the callback to one child
      fractal(ctx, modify(parameters, {
        direction: parameters.direction + options.spread,
      }), options, callback);
      fractal(ctx, modify(parameters, {
        direction: parameters.direction - options.spread
      }), options);
    }, options.branchDelay);
  });
}
