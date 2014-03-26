# What is grow?

Grow is a client-side library for drawing pretty growing things on an HTML5 canvas according to mathematical formulas, written in asynchronous functional javascript. Development of Grow was started by Brian Maissy (brian.maissy@gmail.com) in February 2013.

Current version: 0.3

<a name="shape_functions" />
## Shape functions

The core of grow is its shape functions. Located in grow/shapes, they animate the drawing of primary and complex shapes on a canvas, such as a line segment, curve, or tree. They work asynchronously and recursively, calling themselves and other shape functions to continue drawing. They take as arguments a reference to the canvas, a [params object](#params_objects), and an optional [callback function](#callback_functions) to call when finished.

<a name="callback_functions" />
## Callback functions

According to the Node convention, a callback function is passed as the last argument to all [shape functions](#shape_functions). 

Shape functions call their callbacks when they are done drawing, enabling the caller to know that drawing is finished, and optionally passing along some information about the final state of the shape, in the form of a [params object](#params_objects).

<a name="params_objects" />
## Params objects

A params object is simply an object containing a mapping between parameters and their values. All [shape functions](#shape_functions) and their [callbacks](#callback_functions) pass around params objects instead of lists of parameters. This is because they have a large number of variable parameters; params objects keep function signatures simple and standardized, and improve code readability and modularity. Each shape function documents the parameters it expects to receive in its params object.

Typical values in almost all params objects are x and y coordinates, direction, color, size, and speed. These provide the most basic drawing parameters needed for all shapes. More complex shapes have nested params objects, organized by use.

Params objects are constantly being modified behind the scenes. With each recursive call, delegation to another shape function, or callback, the current shape function passes along a clone or a modified version of its own params object. Grow contains numerous helper functions for cloning, updating, and processing params objects.

In all params objects, a function with no parameters can be substituted for any value. These functions will be evaluated at the beginning of each shape function, allowing a different value to be used each time, for example a randomly generated value. When the shape function calls itself recursively or delegates, it uses the original params object still containing these functions, instead of the evaluated version, allowing the next function to receive different values.

Overview of some special types of parameters that can be included in params objects:

<a name="curve_functions" />
### Curve functions

Curve functions are synchronous functions which describe parametric curves, and are used as parameters to various shape functions to define how to draw their curves. Curve functions take a single number as a parameter, and return an array of two numbers. The returned array is interpreted as an ordered pair of the curve's location at the given value of the parameter. The coordinates used are those which are used by the canvas HTML5 element, with the origin being in the top left and x and y increasing right and downwards, respectively. 

A curve does not need to be defined for all values of its parameter; valid values should be clearly documented. A curve should return NaN or undefined if the provided parameter is illegal or illogical. 

A number of built-in curve functions are included with Grow, located in grow.js.

<a name="events" />
### Event arrays and handlers

Sometimes a caller wants to know more information about the progress of a shape functions than its final state when it finishes. To do this a shape function can trigger events at various points in its execution. These shape functions take an event array in their params object, containing objects with a parameter and a handler fields. When the function's parameter reaches one of the specified event values, the corresponding handler function is called, optionally with the shape function's current params object as an argument.

# Notes

* Grow could have been implemented a little more cleanly using the library async.js, but I chose not to in order to eliminate dependencies. The example app included does use async.

# Is the project finished?

Grow is an early-stage work in progress. It's currently versioned at 0.x, which is preliminary, unstable development. The initial stable release will be versioned 1.0. The entry-point code in main.js is only an example of how grow is used, not part of the library.

## TODO

* Set defaults for options objects
* Write core abstraction functions (shape generator function)
* Put shape functions in an object, and put everything in a module
* Random color generator
* Make a tweaking interface that allows for modifying the code, or the objects, or at least the parameters
