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

function rotate(vector, theta){
  var x = vector[0], y = vector[1];
  return [
    x*Math.cos(theta) - y*Math.sin(theta),
    x*Math.sin(theta) + y*Math.cos(theta)
  ];
}

// ========== OBJECT HELPER FUNCTIONS ==========

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
