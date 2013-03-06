# Grow by Brian Maissy (brian.maissy@gmail.com)

## What is grow?

Grow is a client-side javascript library for drawing pretty growing things on 
an HTML5 canvas. These pretty things grow according to programmer-defined 
mathematical formulas.

## How does it work?

Shapes are defined by functions which draw them recursively and asynchronously, 
taking as arguments a canvas context, a parameters object, an options object, 
and a callback function. The parameters object describes things about the 
current (first) iteration of the recursively drawn shape, and changes each time
the shape function calls itself. The options object describes things about the 
entire shape, and is passed along unmodified.

Some shapes call other shapes as part of their own drawing, like a vine drawing 
a flower. Other shapes call non-recursive helper functions to draw themselves. 
Yet other shapes, like tree, call themselves in multiple recursion, or 
like segment, call themselves in a single chain of recursion.

The shape functions are each found in their own file in the shapes directory of
the client code, such as segment.js, fractals.js, etc.

## Is the project finished?

Grow is an early-stage work in progress.

* It is currently implemented as a meteor.js project, but just for development, 
  in order to use the automatic refresh and code pushing aspects of meteor. 
* The controller code in grow.js is only an example of how grow is used, and 
  will not be in the final release. 
* The functions in helpers.js may not belong in the final release of grow.
* As of right now, grow has inline documentation of its process, but no formal 
  documentation of its API. The API is documented by example in the controller
  grow.js.
