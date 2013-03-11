// recursively animates the drawing of a vine
function vine(ctx, parameters, options, callback){

  // all vines are green
  ctx.strokeStyle = '#009900';

  // draw the initial curve of the first branch
  curve(ctx, modify(parameters.curve, {
  }), modify(options.curve, {
    startX: parameters.x,
    startY: parameters.y,
    direction: parameters.direction,
    size: parameters.size
  }), callback);

}
