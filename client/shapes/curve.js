// recursively animates the drawing of a curve 
function curve(ctx, parameters, options, callback){
  // if we are at the end of the iteration, finish
  
  if(parameters.parameter >= options.bound){
    if(callback) callback();
    return;
  }

  for(var i=0, len=options.events.length; i<len; i++){
    var event = options.events[i];
    if(!event.processed && parameters.parameter >= event.location){
      options.eventHandler(event, parameters, options);
      event.processed = true;
    }
  }

  var start = rotate(options.fn(parameters.parameter), options.direction-Math.PI/2);
  parameters.parameter += options.step;
  var end = rotate(options.fn(parameters.parameter), options.direction-Math.PI/2);

  var startX = options.startX + start[0]*options.size;
  var startY = options.startY - start[1]*options.size;
  var endX = parameters.x = options.startX + end[0]*options.size;
  var endY = parameters.y = options.startY - end[1]*options.size;
  parameters.direction = direction(startX, startY, endX, endY);

  // gradually draw the line segment
  segment(ctx, startX, startY, endX, endY, options.segmentGrowthSpeed, function(){
    // continue the curve by drawing the next segment 
    curve(ctx, parameters, options, callback);
  });
}
