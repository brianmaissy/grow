window.onload = function(){
  var canvas = initCanvas(document.getElementById('canvas'));

  //drawTrees(canvas);
  drawVines(canvas);
}

function drawVines(canvas){
  // set up parameters
  var params = {
    x: async.apply(randomize, 199.5, 100),
    y: 0.5,
    direction: async.apply(randomize, Math.PI/3, Math.PI/6),
    size: async.apply(randomize, 80, 10),
    speed: 80,
    color: '#00ff00',
    curve: {
      curveFunction: curves.vineBranch,
      parameterStart: 0,
      parameterEnd: async.apply(randomize, Math.PI/2, Math.PI/6),
      parameterStep: Math.PI/15,
    },
    branch: {
      locations: removeCloseNumbers.curry(Math.PI/12).compose(async.apply(randomNumbers, 3, Math.PI/12, Math.PI/2)),
      delay: 100,
      angle: 0,
      shrink: function(n){ return n < 30 ? 0 : randomize(n - 15, 5); },
      maxDepth: 6,
      tint: 48,
    },
    curl: {
      size: async.apply(randomize, 0.01, 0.005),
    },
    decorations: [{
      locations: removeCloseNumbers.curry(Math.PI/12).compose(async.apply(randomNumbers, 3, Math.PI/4, Math.PI/2)),
      size: 0.1,
      speed: 10,
      color: '#ff0066',
      delay: 1000,
      curve: {
        curveFunction: curves.flower,
        parameterStart: 0,
        parameterEnd: 2*Math.PI,
        parameterStep: Math.PI/12,
      },
    }, {
      locations: async.apply(randomNumbers, 2, Math.PI/4, Math.PI/2),
      deflect: function(originalAngle){ return 3*Math.PI/2; },
      size: 0.075,
      speed: 0.5,
      color: '#0066ff',
      delay: 100,
      curve: {
        curveFunction: curves.tassles,
        parameterStart: 0,
        parameterEnd: 2*Math.PI,
        parameterStep: Math.PI/12,
      },
    }],
  };
  // continuously run the animation
  async.whilst(always, function(callback){
    async.series([
      async.apply(vine, canvas, params),
      delay(500),
      async.apply(canvas.clear),
    ], callback);
  });
}

function drawTrees(canvas){
  // set up generic parameters
  var params = {
    x: 199.5,
    y: 0.5,
    direction: Math.PI/2,
    size: 50,
    speed: 100,
    color: '#ff0000',
    branch: {
      delay: 100,
      angle: Math.PI/3,
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
      async.apply(canvas.clear),
      // wait a little bit before running it again
      delay(params.branch.delay)
    ], callback);
  });
}
