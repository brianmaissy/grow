if (Meteor.isClient) {
  var ctx;

  // when the page loads,
  window.onload = function(){
    // store a reference to the context
    ctx = document.getElementById('canvas').getContext('2d');
    // and draw the fractals
    drawFractals();
  }

  // repeatedly draws an animated growing fractal
  function drawFractals(){
    // set up the common parameters and options
    var parameters = {
      // the current growth location of the tree
      x: 0,
      y: 399.5,
      // the length of the next branch of the tree
      size: 0,
      // the direction in which the tree is growing, in radians
      direction: Math.PI/2,
      // the current tint of the tree
      tint: 0
    };
    var options = {
      // the base color of the tree, either 'red', 'green', or 'blue'
      color: 'red',
      // the interval at which to increase the tint at each branch
      tintInterval: 32, 
      // the time interval to delay at each branch
      branchDelay: 0,
      // the speed at which line segments should grow, in pixels per second
      segmentGrowthSpeed: 100,
      // the angle, in radians, at which each branch should deflect to the side
      spread: Math.PI/3,
      // the function determining the length of a branch given the length of its parent branch
      shrink: function(n){ return (n<2) ? 0 : .85*Math.pow(n, .92)-1; }
    };
    // continuously run the animation
    async.whilst(always, function(callback){
      async.series([
        // draw the three fractals
        async.apply(fractal, modify(parameters, {
          x: 100.5,
          size: 60
        }), modify(options, {
          color: 'red'
        })),
        async.apply(fractal, modify(parameters, {
          x: 260.5,
          size: 40
        }), modify(options, {
          color: 'green'
        })),
        async.apply(fractal, modify(parameters, {
          x: 200.5,
          size: 100
        }), modify(options, {
          color: 'blue'
        })),
        // wait a while
        delay(2000),
        // clear the screen
        async.apply(clear),
        // wait a little bit before running it again
        delay(options.branchDelay)
      ], callback);
    });
  }

  // recursively draws a fractal
  function fractal(parameters, options, callback){
    // if we are at the end of the iteration, return
    if(parameters.size === 0){
      // but if we have a callback, call it first
      if(callback) callback();
      return;
    }

    // set the color based on the tint
    var tintString = parameters.tint.toString(16);
    if(tintString.length < 2) tintString = '0' + tintString;
    if(options.color === 'red'){
      ctx.strokeStyle='#ff' + tintString + tintString;
    }else if(options.color === 'green'){
      ctx.strokeStyle='#' + tintString + 'ff' + tintString;
    }else if(options.color === 'blue'){
      ctx.strokeStyle='#' + tintString + tintString + 'ff';
    }

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
    growSegment(startX, startY, parameters.x, parameters.y, options.segmentGrowthSpeed, function(){
      // set the timeout for the next iterations
      setTimeout(function(){
        // only pass the callback to one child
        fractal(modify(parameters, {
          direction: parameters.direction + options.spread,
        }), options, callback);
        fractal(modify(parameters, {
          direction: parameters.direction - options.spread
        }), options);
      }, options.branchDelay);
    });
  }

  // recursively animates the growth of a line segment
  function growSegment(startX, startY, endX, endY, speed, callback){
    // calculate the distance to grow
    var distance = Math.sqrt(Math.pow(endX-startX, 2)+Math.pow(endY-startY, 2));
    if(distance<1){
      // if we're already there, finish
      callback();
    }else{
      // otherwise, prepare the line segment
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      // calculate the position of the first step
      var x = startX + (endX-startX)/distance;
      var y = startY + (endY-startY)/distance;
      // draw the line segment
      ctx.lineTo(x, y);
      ctx.stroke();
      setTimeout(function(){
        // draw the remainder of the segment
        growSegment(x, y, endX, endY, speed, callback); 
      }, 1000/speed);
    }
  }

  // ========== HELPER FUNCTIONS ==========

  // clears the canvas
  function clear(callback){
    ctx.clearRect(0, 0, 400, 400);
    // if passed a callback, call it
    if(callback) callback();
  }

  // utility function for modifying an options object
  function modify(original, changes){
    var result = {};
    for(attr in original){
      if(original.hasOwnProperty(attr)){
        result[attr] = original[attr];
      }
    }
    for(attr in changes){
      if(changes.hasOwnProperty(attr)){
        result[attr] = changes[attr];
      }
    }
    return result;
  }

  // creates a function which takes a callback and calls it after
  // delaying for the specified amount of time
  function delay(amount){
    return function(callback){
      setTimeout(callback, amount); 
    };
  }

  // always-true predicate
  function always() {
    return true;
  }
}
