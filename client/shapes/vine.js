// recursively animates the drawing of a vine
function vine(ctx, parameters, options, callback){

  // all vines are green
  ctx.strokeStyle = '#009900';

  // if the size has run out, stop branching
  if(parameters.size === 0) parameters.branches = 0;

  // keep track of number of drawing threads, to know when to call back
  var activeThreads = 1;

  // draw the initial curve of the first branch
  curve(ctx, modify(parameters.curve, {
  }), modify(options.curve, {
    startX: parameters.x,
    startY: parameters.y,
    direction: parameters.direction,
    size: parameters.size,
    eventHandler: onCurveEvent,
    fn: function(p){
      // reverse the x coordinate to implement mirror
      var res = options.curve.fn(p);
      if(parameters.mirror) res = [-res[0], res[1]];
      return res;
    }
  }), threadFinished);

  // called when we get to a curve event
  function onCurveEvent(event, curveParameters, curveOptions){
    if(event.action == 'branch' && parameters.branches > 0){
      branch(curveParameters);
    }
  }

  function branch(curveParameters){
    activeThreads++;
    var branchAngle = options.branchAngle * (parameters.mirror ? -1 : 1);
    var newDirection = curveParameters.direction + branchAngle;
    if(newDirection < 0) newDirection += Math.PI;
    vine(ctx, modify(parameters, {
      x: curveParameters.x,
      y: curveParameters.y,
      direction: newDirection,
      size: options.shrink(parameters.size),
      mirror: !parameters.mirror,
      branches: parameters.branches - 1,
    }), modify(options, {}), threadFinished);
  }
  
  function threadFinished(){
    activeThreads--;
    if(activeThreads == 0 && callback) callback();
  }
}
