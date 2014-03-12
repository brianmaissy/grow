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
    branch:
        locations (the parameter locations on the curve to branch)
        delay (the interval to delay at each branch, in milliseconds)
        angle (the angle, in radians, at which each branch should deflect to the side)
        shrink (a function taking the size of the vine and returning the size of its branches)
        maxDepth (the maximum branching depth, zero means don't branch at all - branching may stop earlier if the shrink function returns 0)
        tint (the amount to tint the branches towards white [0,255])

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
        if(Math.PI/2 < curveParams.direction < 3*Math.PI/2){   
          branchDirection -= params.branch.angle;
        }else{
          branchDirection += params.branch.angle;
        }
        vine(canvas, modify(originalParams, {
          x: curveParams.x,
          y: curveParams.y,
          direction: normalize(branchDirection),
          size: params.branch.shrink(params.size),
          color: tintColor(params.color, params.branch.tint),
          curve: modify(originalParams.curve, {
            curveFunction: mirrorHorizontal(params.curve.curveFunction),
          }),
          branch: modify(originalParams.branch, {
            maxDepth: params.branch.maxDepth - 1,
          }),
        }), childFinished);
      });
    }
  }

  // draw the first curve
  var curveParams = modify(params, params.curve);
  curveParams.events = params.branch.locations.map(function(location){
    return {parameter: location, handler: branch};
  });
  curve(canvas, curveParams, childFinished);
}
