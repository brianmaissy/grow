if (Meteor.isClient) {
  window.onload = function(){
    var canvas = document.getElementById('canvas');
    drawFractals(canvas);
  }

  // repeatedly draws an animated growing fractal
  function drawFractals(canvas){
    var ctx = canvas.getContext('2d');

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
        async.apply(fractal, ctx, modify(parameters, {
          x: 100.5,
          size: 60
        }), modify(options, {
          color: 'red'
        })),
        async.apply(fractal, ctx, modify(parameters, {
          x: 260.5,
          size: 40
        }), modify(options, {
          color: 'green'
        })),
        async.apply(fractal, ctx, modify(parameters, {
          x: 200.5,
          size: 100
        }), modify(options, {
          color: 'blue'
        })),
        // wait a while
        delay(2000),
        // clear the screen
        async.apply(clear, canvas),
        // wait a little bit before running it again
        delay(options.branchDelay)
      ], callback);
    });
  }
}
