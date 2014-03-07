// ========== DRAWING HELPER FUNCTIONS ==========

// create a tint of a named color, with a tint between 0 and 256
function tintColor(colorString, tint){
  var tintString = tint.toString(16);
  if(tintString.length < 2) tintString = '0' + tintString;
  if(colorString === 'red'){
    return '#ff' + tintString + tintString;
  }else if(colorString === 'green'){
    return '#' + tintString + 'ff' + tintString;
  }else if(colorString === 'blue'){
    return '#' + tintString + tintString + 'ff';
  }else return '#000000';
}

// clears the canvas
function clear(canvas, callback){
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

// utility function for modifying an options object
// deep copies the attributes of both original and changes into a new object
function modify(original, changes){
  var result = {};
  deepCopyInto(original, result);
  deepCopyInto(changes, result);
  return result;
}

// deep copies the attributes of source into dest and returns a reference to dest
function deepCopyInto(source, dest){
  for(attr in source){
    if(source.hasOwnProperty(attr)){
      if(source[attr].constructor == Array){
        dest[attr] = deepCopyInto(source[attr], []);
      }else if(typeof source[attr] == 'object'){
        dest[attr] = deepCopyInto(source[attr], {});
      }else{
        dest[attr] = source[attr];
      }
    }
  }
  return dest;
}

// ========== CONTROL FLOW HELPER FUNCTIONS ==========

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
