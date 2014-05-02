Lesson 07 Normalized Device Coordinates (NDC)
=============================================

This lesson launches the "Build our own Render Engine" module!

## NDC to Screen Coordinates

So far, we have been drawing everything with screen coordinates in "pixel space". This couples us to the size of the screen. Now we want to use Normalized Device Coordinates to define things in our scene so that they draw properly regardless of the size of the screen. NDC is defined (=> means "maps to")

| for x           | for y            |
|-----------------|------------------|
| -1 => 0         | -1 => height - 1 |
| +1 => width - 1 | +1 => 0          |

## Some High Level Architecture

We can encapsulate some of our code into classes that have certain responsibilities. Let's start using these class names to keep everything clear and keep everyone on the same page. Assignment 7 will have some example code provided.

## RenderBuffer

Responsible for grabbing a canvas, context, and imageData from a given elementID. Owns the setPixel function and knows how to flush its own buffer (draw to the screen).

* ctor(elementID)
* width, height
* setPixel(x, y, color)
* flush()

## RenderEngine

Responsible for drawing on a RenderBuffer. Has functions for drawing lists of points, lines, and triangles. For now we are dealing with just points. RenderEngine will do the coordinate conversion from Normalized Device Coordinates to Pixel (Screen) Coordinates.

* ctor(RenderBuffer)
* drawPoints(Array(vertices))

## Vertex

Vertices know about their position and color. The BasicVertex provided gets its color from just what was passed in. In the future, vertices may get smarter and get their color in other ways, like from an image map.
