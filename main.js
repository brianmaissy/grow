window.onload = function(){
  var canvas = initCanvas(document.getElementById('canvas'));

  drawTrees(canvas);
  //drawVines(canvas);
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
      fn: curves.vineBranch,
      // the step by which to evaluate the branch curve
      step: Math.PI/15,
      // events to trigger during the curve progression
      events: randomBranches(),
      // the parameter at which to stop the branch curve
      bound: randomize(2*Math.PI/3, Math.PI/6),
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
  // set up generic parameters
  var params = {
    x: 199.5,
    y: 399.5,
    size: 50,
    direction: Math.PI/2,
    speed: 100,
    color: '#ff0000',
    branch: {
      delay: 100,
      spread: Math.PI/3,
      shrink: function(n){ return (n<2) ? 0 : .85*Math.pow(n, .92)-1; },
      tint: 32,
    },
  };
  // continuously run the animation
  async.whilst(always, function(callback){
    async.series([
      // draw three trees, each with slightly different parameters
      async.apply(tree, canvas, modify(params, {
        x: 100.5,
        size: 60,
        color: '#ff0000',
      })),
      async.apply(tree, canvas, modify(params, {
        x: 260.5,
        size: 40,
        color: '#00ff00',
      })),
      async.apply(tree, canvas, modify(params, {
        x: 200.5,
        size: 100,
        color: '#0000ff',
      })),
      // wait a while
      delay(2000),
      // clear the screen
      async.apply(clear, canvas),
      // wait a little bit before running it again
      delay(params.branch.delay)
    ], callback);
  });
}
