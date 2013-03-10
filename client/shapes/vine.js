// recursively animates the drawing of a vine
function vine(ctx, parameters, options, callback){

  // all vines are green
  ctx.strokeStyle = '#009900';

  var initialCurveParameter = parameters.curve.parameter;

  // draw the initial curve of the first branch
  options.curve = modify(options.curve, {
    startX: parameters.x,
    startY: parameters.y,
    direction: parameters.direction,
    size: parameters.size
  });
  curve(ctx, parameters.curve, options.curve, function(){
    parameters.curve.parameter = initialCurveParameter;
    callback();
  });

}
