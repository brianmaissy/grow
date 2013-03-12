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
      branch(curveParameters.x, curveParameters.y, curveParameters.direction);
    }
  }

  function branch(x, y, direction){
    // record a new active drawing thread
    activeThreads++;
    // calculate the new branching direction
    var branchAngle = options.branchAngle * (parameters.mirror ? -1 : 1);
    var newDirection = normalize(direction + branchAngle);
    // recursively draw a new vine
    vine(ctx, modify(parameters, {
      x: x,
      y: y,
      direction: newDirection,
      size: options.shrink(parameters.size),
      mirror: !parameters.mirror,
      branches: parameters.branches - 1,
    }), modify(options, {
      curve: modify(options.curve, {
        events: randomBranches(), 
      }),
    }), threadFinished);
  }
  
  function threadFinished(){
    activeThreads--;
    // when all active threads are finished, call back
    if(activeThreads == 0 && callback) callback();
  }
}

// ========== UTILITY OBJECTS AND FUNCTIONS FOR DESCRIBING VINES ==========

// returns an array of a random amount of randomly located branches
// usually 2, sometimes 1 or 3
// distributed equally between 0 and PI/2
// drops branches located within PI/8 of each other
function randomBranches(){
  var branchEvents = [];
  var random = Math.random();
  randomBranch();
  if(random > .6) randomBranch();
  if(random > .8) randomBranch();
  return branchEvents;

  function randomBranch(){
    var location = .25*Math.PI + .5*Math.PI*(Math.random()-.5);
    for(var i=0; i<branchEvents.length; i++){
      if(Math.abs(branchEvents[i].location - location) < Math.PI/8) return;
    }
    branchEvents.push({action: 'branch', location: location});
  }
}
