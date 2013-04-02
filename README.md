# What is grow?

Grow is a client-side javascript library for drawing pretty growing things on 
an HTML5 canvas. These pretty things grow according to programmer-defined 
mathematical formulas. Development of Grow was started by Brian Maissy 
(brian.maissy@gmail.com) in February 2013.

Current version: 0.2

# How does it work? 

Shapes are defined by [grow functions](#grow_functions) which draw shapes 
recursively and asynchronously, taking as arguments a 
[context object](#context_objects), an [options object](#options_objects), and a 
[callback function](#callback_functions). The grow functions use 
[shape functions](#shape_functions) which are built into grow to do the 
actual drawing, and use [tool functions](#tool_functions) which are included in 
grow to help with control flow, math, and manipulation of options objects.

<a name="grow_functions" />
## Grow functions

The grow functions are the primary end-user API of Grow. They are used to draw
high-level shapes, such as a vine.

UNDER CONSTRUCTION
DOCUMENT THE USAGE OF THE GROW FUNCTIONS HERE, WITH EXAMPLES 

<a name="shape_functions" />
## Shape functions

Shape functions, located in grow.shapes, animate the drawing of primitive shapes
on a canvas, such as a circle, line segment, or arbitrary curve. They are 
parameterized, and can trigger events at specified parameter values. 
[Grow functions](#grow_functions) call shape functions with a 
[context object](#context_objects), an [options object](#options_objects), an 
[events object](#events), and a [callback function](#callback_functions)
.

UNDER CONSTRUCTION
DOCUMENT THE USAGE OF THE SHAPE FUNCTIONS HERE, WITH EXAMPLES

<a name="curve_functions" />
## Curve functions

Curve functions are synchronous functions which take a single number as a 
parameter, and return an array of two numbers. The returned array is interpreted
as an ordered pair of the curve's location at the given value of the parameter.
The coordinates used are those which are used by the canvas HTML5 element, with
the origin being in the top left and x and y increasing right and downwards,
respectively. 

A curve does not need to be defined for all values of its parameter; valid values 
should be clearly documented. A curve should return NaN or undefined if the 
provided parameter is illegal or illogical. 

A number of built in parameterized curve functions are included with Grow,
located in grow.curves.

UNDER CONSTRUCTION
EXPLAIN BUILT-IN CURVE FUNCTIONS

<a name="tool_functions" />
## Tool functions

A number of useful helper functions are included in grow.tools. These functions
are used by grow for control flow, math, and object manipulation.

UNDER CONSTRUCTION
DOCUMENT THE USAGE OF THE TOOL FUNCTIONS HERE

<a name="context_objects" />
## Context objects

The context object contains the canvas drawing context, and the current position
and orientation of the growing object. These are the values which are relevant 
to any and all [grow functions](#grow_functions), and also to the 
[shape functions](#shape_functions) which support them. 

The grow functions modify the context as necessary before delegating to other 
grow functions or calling themselves recursively, and are passed as-is to shape
functions. All functions should pass clones of context objects as arguments. 
The context is continuously modified by the shape functions as they animate 
growth, and the copies of the modified version are passed to their 
[event handlers](#events), and to the [callback function](#callback_functions). 
Grow functions don't pass a context to their callbacks.

<a name="options_objects" />
## Options objects

The options object is a simple map from options names to values that provides 
details either to a [grow function](#grow_functions) or to a 
[shape function](#shape_functions) about how it should draw. Grow uses options 
objects instead of simple parameters to keep the signatures of all grow and 
shape functions simple and standardized, and to improve readability. 

Options objects are modified by grow functions before calling themselves 
recursively, and new or modified options objects are passed to other grow 
functions and shape functions. All functions should pass clones of options 
objects as arguments. 

Options objects can be nested, instead of increasing the complexity of option 
names. For example, the options object passed to a vine might have a size
option. Instead of containing an option such as flowerSize to specify the size
of flowers growing from the vine, the main options object has a nested options 
object under the name flower, which in turn contains all the options relevant to
drawing the flowers, which will be extracted and passed to grow.flower().

<a name="events" />
## Events objects and handlers

The events object is a way to trigger simplified events during the drawing of a
shape. An events object is a mapping from parameter values to handler functions. 
The events object is passed to the [shape function](#shape_functions), and the 
first time the parameter exceeds each specified value, the associated handler 
function is called, passing as the only argument a clone of the shape function's
current [context object](#context_objects).

<a name="callback_functions" />
## Callback functions

According to the Node convention, a callback function is passed as the last
argument to all [grow functions](#grow_functions) and 
[shape functions](#shape_functions). 

Shape functions call their callbacks immediately when they are done drawing, 
regardless of [events](#events) triggered, passing as the only argument the 
[context object](#context_objects).

Grow functions call their callbacks when they are completely done drawing,
including any recursive calls or delegations to other grow functions. Therefore
it is the responsibility of each grow function to keep track of all its child
drawing executions, and call back when they have each called back as well. The
grow [tool functions](#tool_functions) can help with this control flow problem. 
No context object is passed to the callback by a grow function because there 
isn't necessarily a single correct context when the drawing is done, nor is it 
useful to the caller. The main usage of the callback functions is for the 
top-level caller of the grow function to have a way to know when the task is 
completed.

# Is the project finished?

Grow is an early-stage work in progress. It's currently versioned at 0.x, which
is preliminary, unstable development. The initial stable release will be 
versioned 1.0.

* It is currently implemented as a meteor.js project, but just for development, 
  in order to use the automatic refresh and code pushing aspects of meteor. 
* The controller code in grow.js is only an example of how grow is used, and 
  will not be in the initial release. 
* The functions in helpers.js may not belong in the initial release of grow.
* As of right now, grow has inline documentation of its process, but no formal 
  documentation of its API. The API is documented by example in the controller
  grow.js.

## TODO

* Implement context object
* Implement single options object system
* Implement new events system
* Implement new control flow management tool
* Improve options object tools
* Set defaults for options objects
* make all options objects optionally contain a function instead of any value, and an 
  evaluate function which returns the original object but with the function replaced 
  by its return value. Each function will evaluate its options object upon invocation.
  Modify might need to be updated accordingly. Randomize will return a function.
* Document grow functions, shape functions, and tools
* Tests
* Implement new organization, not as a meteor project.

