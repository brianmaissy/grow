// given a canvas element, returns its 2d context augmented with the width and height of the canvas element itself
function initCanvas(canvasElement){
  var canvas = canvasElement.getContext('2d');
  canvas.width = canvasElement.width;
  canvas.height = canvasElement.height;
  return canvas;
}

// ========== CURVE FUNCTIONS ==========

var curves = {
    vineBranch: function(t){
        return [.65-.65*Math.cos(t), Math.sin(t)];
    },
}

// ========== DRAWING HELPER FUNCTIONS ==========

// tints the given hex color towards white by the given tint value between 0 and 256
function tintColor(hexColorString, tint){
  result = '#'
  for(var i=1; i<=5; i+=2){
    channelString = hexColorString.substring(i, i+2);
    channelValue = parseInt(channelString, 16);
    channelValue += tint;
    result += Math.min(channelValue, 255).toString(16);
  }
  return result;
}

// clears the canvas
function clear(canvas, callback){
  canvas.clearRect(0, 0, canvas.width, canvas.height);
  // if passed a callback, call it
  if(callback) callback();
}

// ========== MATH HELPER FUNCTIONS ==========

// rotates a vector by an angle
function rotate(vector, theta){
  var x = vector[0], y = vector[1];
  return [
    x*Math.cos(theta) - y*Math.sin(theta),
    x*Math.sin(theta) + y*Math.cos(theta)
  ];
}

// normalizes an angle to between 0 and 2PI
function normalize(n){
  if(n < 0) return normalize(n + 2*Math.PI);
  else if(n > 2*Math.PI) return normalize(n - 2*Math.PI);
  else return n;
}

// calculates the direction between two points
function direction(startX, startY, endX, endY){
  var deltaX = endX-startX;
  var deltaY = startY-endY;
  if(deltaX === 0) return deltaY > 0 ? Math.PI/2 : 3*Math.PI/2;
  if(deltaY === 0) return deltaX > 0 ? 0 : Math.PI;
  var atan = Math.atan(deltaY/deltaX);
  if(atan >= 0){
    return deltaY > 0 ? atan : atan + Math.PI;
  }else{
    return deltaY > 0 ? atan + Math.PI : atan + 2*Math.PI;
  }
}

// randomly tweaks a number n up to spread in either direction
function randomize(n, spread){
  if(typeof spread == 'undefined') spread = n;
  return n + 2*spread*(Math.random()-.5);
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
    if(source.hasOwnProperty(attr)){
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
    if(original.hasOwnProperty(attr)){
      if(original[attr].constructor == Array || typeof original[attr] == 'object'){
        original[attr] = evaluateThunks(original[attr]);
      }else if(typeof original[attr] == 'function' && original[attr].length == 0){
        original[attr] = original[attr]();
      }
    }
  }
  return original;
}

// ========== ASYNCHRONOUS CONTROL FLOW HELPER FUNCTIONS ==========

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
