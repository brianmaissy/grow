if (Meteor.isClient) {
  window.onload = function(){
    var canvas = document.getElementById('canvas');
    //drawTrees(canvas);
    drawVines(canvas);
  }

  // repeatedly draws animated growing vines
  function drawVines(canvas){
    var ctx = canvas.getContext('2d');

    // set up the common parameters and options
    var parameters = {
      // the current growth location of the vine
      x: 199.5,
      y: 399.5,
      // the direction in which the vine is growing, in radians
      direction: 5*Math.PI/8,
      // the length of the next branch of the vine
      size: 80,
      // whether or not to mirror the x-coordinate of the curve
      mirror: false,
      // the maximum number of generations of descendant branches
      branches: 5,
      // parameters for the curve of the vine branch
      curve: {
        // the starting parameter of the vine branch curve
        parameter: 0,
      },
    };
    var options = {
      shrink: function(n){ return n < 30 ? 0 : randomize(n - 20, 10); },
      branchAngle: randomize(Math.PI/6), 
      curve: {
        // a parametric function describing the curve of the vine branches
        fn: function(t){ return [.65-.65*Math.cos(t), Math.sin(t)]; },
        // the step by which to evaluate the branch curve
        step: Math.PI/15,
        // events to trigger during the curve progression
        events: randomBranches(),
        // the parameter at which to stop the branch curve
        bound: randomize(3*Math.PI/4, Math.PI/4),
        // the speed at which curve segments should grow, in pixels per second
        segmentGrowthSpeed: 50,
      },
    };
    async.whilst(always, function(callback){
      async.series([
        async.apply(vine, ctx, parameters, modify(options, {
          curve: modify(options.curve, { events: randomBranches() })
        })),
        delay(500),
        async.apply(clear, canvas),
      ], callback);
    });
  }

  // repeatedly draws animated growing fractal trees
  function drawTrees(canvas){
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
        // draw the three trees
        async.apply(tree, ctx, modify(parameters, {
          x: 100.5,
          size: 60
        }), modify(options, {
          color: 'red'
        })),
        async.apply(tree, ctx, modify(parameters, {
          x: 260.5,
          size: 40
        }), modify(options, {
          color: 'green'
        })),
        async.apply(tree, ctx, modify(parameters, {
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
