/* 

Draws a growing vine asynchronously.

Params:
    x (starting x-coordinate)
    y (starting y-coordinate)
    direction (direction for the first curve, in radians)
    size (size of the first component curve)
    speed (the rate at which to draw component line segments, in pixels per second)
    color (the color of the first curve, in hex)
    curve:
        curveFunction (the function to evaluate curve locations for each parameter value)
        parameterStart (the initial value of the parameter, or where on the curve to start drawing)
        parameterEnd (the final value of the parameter, or where on the curve to end drawing)
        parameterStep (the accuracy with which to render the curve)
    curl:
        size (the size of the curl on the end of each branch - multiplied by the vine size)
    branch:
        locations (the parameter locations on the curve to branch)
        delay (the interval to delay at each branch, in milliseconds)
        angle (the angle, in radians, at which each branch should deflect to the side)
        shrink (a function taking the size of the vine and returning the size of its branches)
        maxDepth (the maximum branching depth, zero means don't branch at all - branching may stop earlier if the shrink function returns 0)
        tint (the amount to tint the branches towards white [0,255])
    decorations[]:
        locations (the parameter locations on the curve to draw the decoration)
        deflect (function taking the curve tangent direction and returning the direction for the decoration - undefined implies the identity function)
        size (the size of the decoration - multiplied by the vine size)
        speed (the speed to draw the decoration - multiplied by the vine speed)
        color (the color of the decoration - will be affected by branch tint)
        delay (the interval to delay before decorating, in milliseconds)

Callback:
    Called when the tree is fully drawn. Passes no arguments.

*/
function vine(canvas, originalParams, callback){
  // evaluate the parameters
  var params = evaluateThunks(clone(originalParams));

  // track callbacks
  var childFinished = waitForChildren(1, callback);

  // function to call when reaching a branching point on the curve
  function branch(curveParams){
    // base case
    if(params.branch.maxDepth > 0){
      // draw a branch
      childFinished.add();
      waitAndCall(params.branch.delay, function(){
        var branchDirection = curveParams.tangentDirection;
        if(leftwards(branchDirection)){
          branchDirection += params.branch.angle;
        }else{
          branchDirection -= params.branch.angle;
        }
        vine(canvas, modify(originalParams, {
          x: curveParams.x,
          y: curveParams.y,
          direction: normalize(branchDirection),
          size: params.branch.shrink(params.size),
          color: tintColor(params.color, params.branch.tint),
          curve: modify(originalParams.curve, {
            curveFunction: mirrorVertical(params.curve.curveFunction),
          }),
          branch: modify(originalParams.branch, {
            maxDepth: params.branch.maxDepth - 1,
          }),
        }), childFinished);
      });
    }
  }

  // function to call when reaching a decoration point on the curve
  function decorate(decoration, curveParams){
    // set defaults
    decoration = append(decoration, {
      deflect: identity,
    });
    // draw a decoration
    childFinished.add();
    waitAndCall(decoration.delay, function(){
      curve(canvas, modify(decoration.curve, {     
        x: curveParams.x,
        y: curveParams.y,
        direction: decoration.deflect(curveParams.tangentDirection),
        size: params.size * decoration.size,
        speed: params.speed * decoration.speed,
        color: decoration.color,
        events: [],
      }), childFinished);
    });
  }

  // prepare the parameters for the first curve
  var curveParams = modify(params, params.curve);
  // prepare the branch events
  curveParams.events = params.branch.locations.map(function(location){
    return {parameter: location, handler: branch};
  });
  // prepare the decoration events
  for(var i=0, len=params.decorations.length; i<len; i++){
    curveParams.events = curveParams.events.concat(params.decorations[i].locations.map(function(location){
      return {parameter: location, handler: decorate.curry(params.decorations[i])};
    }));
  }
  // draw the first curve
  curve(canvas, curveParams, function(curveParams){
    curve(canvas, modify(curveParams, {
      direction: curveParams.tangentDirection,
      size: curveParams.size * params.curl.size,
      curveFunction: leftwards(curveParams.tangentDirection) ? mirrorVertical(curves.curl) : curves.curl,
      parameter: 0,
      parameterStart: 0,
      parameterEnd: 4*Math.PI,
      parameterStep: Math.PI/12,
      events: [],
    }), childFinished)
  });
}
