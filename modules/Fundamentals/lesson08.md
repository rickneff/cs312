Lesson 08 Basic Shaders
=======================

* Remember what was done in the simple gradient assignment?
* What about the complex gradient assignment?
* Look at the results from the NDC coordinates and drawing pixels assignment:
  * Remember --- there are multiple ways to do classes.
  * The transformation function
  * Watch for the Round function
* Some modifications to the existing code
  * What is the difference between a vertex and a point?
  * Decision: use vectors of floats, not a Point class
  * What is a [Shader](http://en.wikipedia.org/wiki/Shader)?
    * Vertex shaders are used to get the position of a vertex, start with the identity
    * Fragment shaders are used to get the color of a vertex, start with BasicColor
* Next create a Vertex shader that multiplies by a matrix
  * Matrix multiplication needs vertices to be vec4 objects
    * Remember homogeneous coordinates?
* If time, talk about:
  * [OpenGL Transformation Pipeline](http://www.songho.ca/opengl/gl_transform.html)
  * [Orthographic Projections](http://en.wikipedia.org/wiki/Orthographic_projection_(geometry))
