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
      y: 399.5,
      direction: Math.PI/2,
      tint: 0
    };
    var options = {
      tintInterval: 32, 
      animationDelay: 150,
      spread: Math.PI/3,
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
        delay(options.animationDelay)
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

    // prepare the line segment
    ctx.beginPath();
    ctx.moveTo(parameters.x, parameters.y);

    // generate the next set of parameters
    parameters = modify(parameters, {
      x: parameters.x + parameters.size * Math.cos(parameters.direction),
      y: parameters.y - parameters.size * Math.sin(parameters.direction),
      size: options.shrink(parameters.size),
      tint: parameters.tint + options.tintInterval
    });

    // draw the line segment
    ctx.lineTo(parameters.x, parameters.y);
    ctx.stroke();

    // set the timeout for the next iterations
    setTimeout(function(){
      // only pass the callback to one child
      fractal(modify(parameters, {
        direction: parameters.direction + options.spread,
      }), options, callback);
      fractal(modify(parameters, {
        direction: parameters.direction - options.spread
      }), options);
    }, options.animationDelay);
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
