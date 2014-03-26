// ========== CURVE FUNCTIONS ==========

// curves start at the origin (0, 0), and have an initial direction of 0 radians (positive first derivative in x and zero first derivative in y at parameter value 0).
var curves = {
  vineBranch: function(t){
    return [Math.sin(t), .65-.65*Math.cos(t)];
  },
  curl: translate([0, 4*Math.PI], rotate(-Math.PI/2, mirrorHorizontal(polar(function(theta){
    return 4*Math.PI-theta;
  })))),
  circle: function(t){
    return [.5*Math.cos(t-3*Math.PI/2), .5*Math.sin(t-3*Math.PI/2)+.5];
  },
  flower: polar(function(theta){
    return Math.sin(2*theta);
  }),
  tassles: function(t){
    return [t, 0];
  },
}

// ========== DRAWING HELPER FUNCTIONS ==========

// given a canvas element, returns a grow canvas. This consists of the canvas element's 2d context, augmented with a clear function, and with its moveTo and lineTo functions replaced to support a coordinate system with the origin in the bottom left corner instead of the top left.
function initCanvas(canvasElement){
  var canvas = canvasElement.getContext('2d');
  var width = canvasElement.width;
  var height = canvasElement.height;

  canvas.clear = function(callback){
    canvas.clearRect(0, 0, width, height);
    finish(callback);
  }

  var originalMoveTo = canvas.moveTo;
  canvas.moveTo = function(x, y){
    originalMoveTo.bind(canvas)(x, height - y);
  }

  var originalLineTo = canvas.lineTo;
  canvas.lineTo = function(x, y){
    originalLineTo.bind(canvas)(x, height - y);
  }
  
  return canvas;
}

// tints the given hex color towards white by the given tint value between 0 and 256
function tintColor(hexColorString, tint){
  var result = '#'
  for(var i=1; i<=5; i+=2){
    channelString = hexColorString.substring(i, i+2);
    channelValue = parseInt(channelString, 16);
    channelValue += tint;
    result += Math.min(channelValue, 255).toString(16);
  }
  return result;
}

// ========== MATH HELPER FUNCTIONS ==========

// rotates a vector or function counterclockwise by an angle in 2D cartesian space
// call it like rotate([0, 1], Math.PI) or rotate(Math.PI, function)
function rotate(vector, theta){
  if(typeof theta == 'function'){
    var originalFunction = theta;
    theta = vector;
    return function(parameter){
      return rotate(originalFunction(parameter), theta);
    }
  }else{
    var x = vector[0], y = vector[1];
    return [
      x*Math.cos(theta) - y*Math.sin(theta),
      x*Math.sin(theta) + y*Math.cos(theta)
    ];
  }
}

// normalizes an angle to between 0 and 2PI
function normalize(n){
  if(n < 0) return normalize(n + 2*Math.PI);
  else if(n > 2*Math.PI) return normalize(n - 2*Math.PI);
  else return n;
}

// calculates the distance between two points
function distance(start, end){
  return Math.sqrt(Math.pow(end[0]-start[0], 2) + Math.pow(end[1]-start[1], 2))
}

// calculates the direction between two points
function direction(start, end){
  var deltaX = end[0]-start[0];
  var deltaY = end[1]-start[1];
  if(deltaX === 0) return deltaY > 0 ? Math.PI/2 : 3*Math.PI/2;
  if(deltaY === 0) return deltaX > 0 ? 0 : Math.PI;
  var atan = Math.atan(deltaY/deltaX);
  if(atan >= 0){
    return deltaY > 0 ? atan : atan + Math.PI;
  }else{
    return deltaY > 0 ? atan + Math.PI : atan + 2*Math.PI;
  }
}

// converts a polar function r=f(theta) to a parametric cartesian function [x,y]=f(p) where theta=p
function polar(rFunctionOfTheta){
  return function(parameter){
    var theta = parameter;
    var radius = rFunctionOfTheta(theta);
    return [radius * Math.cos(theta), radius * Math.sin(theta)];
  }
}

// mirrors a parametric function [x,y]=f(p) along the vertical x=0 axis, returning the function [-x,y]=f'(p)
function mirrorHorizontal(originalFunction){
  return function(parameter){
    var point = originalFunction(parameter);
    point[0] = -point[0];
    return point;
  }
}

// mirrors a parametric function [x,y]=f(p) along the horizontal y=0 axis, returning the function [x,-y]=f'(p)
function mirrorVertical(originalFunction){
  return function(parameter){
    var point = originalFunction(parameter);
    point[1] = -point[1];
    return point;
  }
}

// translates a parametric function in cartesian space
function translate(vector, originalFunction){
  return function(parameter){
    var point = originalFunction(parameter);
    point[0] += vector[0];
    point[1] += vector[1];
    return point;
  }
}

// tests whether or not a curve with the given tangent angle is moving leftwards
function leftwards(angle){
  return Math.PI/2 < angle && angle < 3*Math.PI/2;
}

// ========== RANDOM HELPER FUNCTIONS ==========

// returns a random float in the given range, inclusive
function random(min, max){
  return (Math.random()*(max-min)) + min;
}

// returns an array of random numbers in the given range
function randomNumbers(number, min, max){
  return range(number).map(random.bind(null, min, max));
}

// randomly tweaks a number n up to spread in either direction
function randomize(n, spread){
  if(typeof spread == 'undefined') spread = n;
  return n + 2*spread*(Math.random()-.5);
}

// randomly returns an element of the given array
function randomChoice(choices){
  return choices[random(0, choices.length-1)];
}

// ========== HELPER FUNCTIONS FOR ARRAYS OF NUMBERS ==========

// returns an array containing the range of numbers between min (inclusive) and max (not inclusive) (like python's range)
function range(start, stop, step){
  if (typeof stop=='undefined'){
    stop = start;
    start = 0;
  }
  if (typeof step=='undefined'){
    step = 1;
  }
  if ((step>0 && start>=stop) || (step<0 && start<=stop)){
    return [];
  };
  var result = [];
  for (var i=start; step>0 ? i<stop : i>stop; i+=step){
    result.push(i);
  };
  return result;
}

// takes an array of numbers and returns any that are too close to each other
function removeCloseNumbers(threshold, numbers){
  var result = [];

  function compareNumbers(a, b) {
    return a - b;
  }
  numbers.sort(compareNumbers);

  for(var i=0, len=numbers.length; i<len; i++){
    if(result.length == 0 || numbers[i] - result[result.length-1] >= threshold){
      result.push(numbers[i]);
    }
  }
  return result;
}

// ========== OBJECT HELPER FUNCTIONS ==========

// deep updates the first object with the properties in the second object, overwriting existing properties. Returns a new object.
function modify(original, changes){
  var result = clone(original);
  deepCopyInto(changes, result, true);
  return result;
}

// deep updates the first object with the properties in the second object, without overwriting existing properties. Returns a new object.
function append(original, changes){
  var result = clone(original);
  deepCopyInto(changes, result, false);
  return result;
}

// makes a deep clone of the original object. Returns a new object.
function clone(original){
  var result = {};
  deepCopyInto(original, result);
  return result;
}

// deep copies the attributes of source into dest. Returns a reference to dest
function deepCopyInto(source, dest, overwrite){
  if(typeof(overwrite)==='undefined') overwrite = true;

  for(attr in source){
    if(source.hasOwnProperty(attr) && typeof source[attr] != 'undefined'){
      if(source[attr].constructor == Array){
        dest[attr] = deepCopyInto(source[attr], []);
      }else if(typeof source[attr] == 'object'){
        dest[attr] = deepCopyInto(source[attr], {});
      }else{
        if(overwrite || !dest.hasOwnProperty(attr)){
          dest[attr] = source[attr];
        }
      }
    }
  }
  return dest;
}

// deep replaces all 0-parameter functions in an object with the function's return value. Returns the original object.
function evaluateThunks(original){
  for(attr in original){
    if(original.hasOwnProperty(attr) && typeof original[attr] != 'undefined'){
      if(original[attr].constructor == Array || typeof original[attr] == 'object'){
        original[attr] = evaluateThunks(original[attr]);
      }else if(typeof original[attr] == 'function' && original[attr].length == 0){
        original[attr] = original[attr]();
      }
    }
  }
  return original;
}

// ========== CONTROL FLOW HELPER FUNCTIONS ==========

// like setTimeout, but with the order of the arguments reversed
function waitAndCall(timeout, callback){
  setTimeout(callback, timeout);
}

// creates a function which takes a callback and calls it after delaying for the specified amount of time
function delay(timeout){
  return waitAndCall.bind(null, timeout);  
}

// identity function
function identity(argument){
  return argument;
}

// always-true predicate
function always() {
  return true;
}

// calls the given function if it exists, passing the given argument
function finish(callback, argument){
  if(typeof callback == 'function'){
    callback(argument);
  }
}

// simple currying
Function.prototype.curry = function(arg1, arg2, etc){
  var originalFunction = this;
  var originalArguments = Array.prototype.slice.call(arguments);
  // don't remove the arg1, arg2, etc, otherwise evaluateThunks will think this is a thunk
  return function(arg1, arg2, etc){
    return originalFunction.apply(undefined, originalArguments.concat(Array.prototype.slice.call(arguments)));
  }
}

// simple composition
Function.prototype.compose = function(innerFunction){
  var outerFunction = this;
  return function(){
    return outerFunction(innerFunction.apply(undefined,arguments));
  }
}

// creates a function that, when called the specified number of times, calls the original callback
// the function also has an add "method" which can add more callbacks to wait for
function waitForChildren(number, callback){
    var waitingFor = number;

    function countOne(){
      waitingFor--;
      if(waitingFor == 0){
        finish(callback);
      }
    }

    countOne.add = function(number){
       waitingFor += number || 1;
    }

    return countOne;
}
