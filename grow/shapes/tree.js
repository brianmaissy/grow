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
        spread (the angle, in radians, at which each branch should deflect to the side)
        shrink (a function taking the size of the tree and returning the size of its branches)
        tint (the amount to tint the tree color towards white each recursion [0,255])

Callback:
    Called when the tree is fully drawn. Passes no arguments.

*/

function tree(canvas, originalParams, callback){
  var params = evaluateThunks(clone(originalParams));

  // if we are at the end of the iteration, finish
  if(params.size == 0){
    if(callback) callback();
    return;
  }

  // draw the trunk line segment
  segment(canvas, clone(originalParams), function(endingParams){
    // set the timeout for the next iterations
    setTimeout(function(){
      // draw the branches (recurse)
      tree(canvas, modify(originalParams, {
        // modifications that need to be made for each recursion of the tree
        x: endingParams.x,
        y: endingParams.y,
        direction: endingParams.direction + params.branch.spread,
        size: params.branch.shrink(params.size),
        color: tintColor(params.color, params.branch.tint),
      }), callback);
      // only pass the callback to one child (they finish at the same time)
      tree(canvas, modify(originalParams, {
        x: endingParams.x,
        y: endingParams.y,
        direction: endingParams.direction - params.branch.spread,
        size: params.branch.shrink(params.size),
        color: tintColor(params.color, params.branch.tint),
      }));
    }, params.branch.delay);
  });
}
