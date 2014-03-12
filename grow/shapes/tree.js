/* 

Draws a fractal tree asynchronously.

Params:
    x (starting x-coordinate)
    y (starting y-coordinate)
    direction (direction to draw in radians)
    size (length of trunk in pixels)
    speed (the rate at which to draw, in pixels per second)
    color (the base color of the tree, in hex)
    branch:
        delay (the interval to delay at each branch, in milliseconds)
        angle (the angle, in radians, at which each branch should deflect to the side)
        shrink (a function taking the size of the tree and returning the size of its branches)
        tint (the amount to tint the tree color towards white each recursion [0,255])

Callback:
    Called when the tree is fully drawn. Passes no arguments.

*/

function tree(canvas, originalParams, callback){
  // evaluate the parameters
  var params = evaluateThunks(clone(originalParams));

  // check the base case
  if(params.size == 0){
    finish(callback);
    return;
  }

  // draw the trunk line segment
  segment(canvas, params, function(endingParams){
    waitAndCall(params.branch.delay, function(){
      // recurse to draw the branches
      var branchParams = modify(originalParams, {
        x: endingParams.x,
        y: endingParams.y,
        size: params.branch.shrink(params.size),
        color: tintColor(params.color, params.branch.tint),
      });

      var childFinished = waitForChildren(2, callback);

      tree(canvas, modify(branchParams, {
        direction: endingParams.direction + params.branch.angle,
      }), childFinished);
      tree(canvas, modify(branchParams, {
        direction: endingParams.direction - params.branch.angle,
      }), childFinished);
    });
  });
}
