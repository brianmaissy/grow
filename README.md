GROW by Brian Maissy (brian.maissy@gmail.com)

Grow is a client-side javascript library for drawing pretty growing things on 
an HTML5 canvas. These pretty things grow according to programmer-defined 
mathematical formulas.

Shapes are defined by functions which draw them recursively and asynchronously, 
taking as arguments a canvas context, a parameters object, an options object, 
and a callback function. The parameters object describes things about the 
current (first) iteration of the recursively drawn shape, and changes each time
the shape function calls itself. The options object describes things about the 
entire shape, and is passed along unmodified.

The shape functions are each found in their own file in the shapes directory of
the client code, such as segment.js, fractals.js, etc.

This project is currently implemented as a meteor.js project, but just for development, to use the automatic refresh and function pushing aspects of meteor. Also the controller code in grow.js is only an example of how grow is used, and will not be in the final release. Additionally, functions in helpers.js may or may not belong in the final release of grow.
