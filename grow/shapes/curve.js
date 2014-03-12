/* 

Draws a parametric curve asynchronously.

Params:
    x (starting x-coordinate)
    y (starting y-coordinate)
    direction (direction to start growing, equivalent to the angle at which to rotate the curve function, in radians)
    size (the number of pixels into which each unit of curve function range translates)
    speed (the rate at which to draw component line segments, in pixels per second)
    color (the color of the curve, in hex)
    curveFunction (the function to evaluate curve locations for each parameter value)
    parameterStart (the initial value of the parameter, or where on the curve to start drawing)
    parameterEnd (the final value of the parameter, or where on the curve to end drawing)
    parameterStep (the accuracy with which to render the curve)
    events (an array of events to trigger, represented by objects {parameter, handler})

Callback:
    Called when the curve is fully drawn. Passes the final params object.

*/

function curve(canvas, originalParams, callback){
  // initialize internal param state
  originalParams = append(originalParams, {
    parameter: originalParams.parameterStart,
  });

  // evaluate the parameters
  var params = evaluateThunks(clone(originalParams));

  // check the base case
  if(params.parameter >= params.parameterEnd){
    finish(callback);
    return;
  }

  // check if its time to fire an event
  for(var i=0, len=params.events.length; i<len; i++){
    var event = params.events[i];
    if(params.parameter >= event.parameter &&  !event.handled){
      event.handled = true;
      event.handler(clone(params));
    }
  }

  // draw the first segment of the curve
  var currentCurvePoint = rotate(params.curveFunction(params.parameter), params.direction);
  params.parameter += params.parameterStep;
  var nextCurvePoint = rotate(params.curveFunction(params.parameter), params.direction);
  var segmentEndpoint = [params.x + params.size * (nextCurvePoint[0] - currentCurvePoint[0]), 
                         params.y + params.size * (nextCurvePoint[1] - currentCurvePoint[1])];
  var tangentDirection = direction([params.x, params.y], segmentEndpoint);
  segment(canvas, modify(params, {
    direction: tangentDirection,
    size: distance([params.x, params.y], segmentEndpoint),
  }), function(endingParams){
    // recurse to draw the rest of the curve
    curve(canvas, modify(params, {
      x: endingParams.x,
      y: endingParams.y,
      tangentDirection: tangentDirection,
    }), callback);
  });
}
