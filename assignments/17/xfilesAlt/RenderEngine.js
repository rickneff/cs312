// This file now depends on the lerp function defined in MatrixMath.js

function RenderEngine(renderBuffer)
{
   this.renderBuffer = renderBuffer;
}

RenderEngine.prototype.ndc2screen = function(ndcPos)
{
   // Do the divide by W here, and return a vec4
   var iW = 1 / ndcPos[3];
   return [
      Math.round((ndcPos[0] * iW + 1.0) * (this.renderBuffer.width - 1) * 0.5),
      Math.round((1.0 - ndcPos[1] * iW) * (this.renderBuffer.height - 1) * 0.5),
      ndcPos[2], // The perspective projection matrix handled this one already
      ndcPos[3]
   ];
}

RenderEngine.prototype.drawPoint = function(ndc, smoothVars,
                                            vertexShader, fragmentShader)
{
   for (var clipPlaneIdx = 0; clipPlaneIdx < clipPlanes.length; clipPlaneIdx++)
   {
      if (clipPlanes[clipPlaneIdx].pointInPlane(ndc) < 0)
      {
         return;
      }        
   }
   // Now we know we are OK, convert to screen
   var screenPos = this.ndc2screen(ndc);
   var color = fragmentShader.main(smoothVars);
   this.renderBuffer.setPixel(screenPos[0], screenPos[1], color);
}

RenderEngine.prototype.drawPoints = function(verts,
                                             vertexShader,
                                             fragmentShader)
{
   for (var i = 0; i < verts.length; i++)
   {
      // Clip everything against the NDC
      var ndc = vertexShader.main(verts[i]);
      var smoothVars = vertexShader.getSmoothVars(verts[i]);
      this.drawPoint(ndc, smoothVars, vertexShader, fragmentShader);
   }
}

function TwFinder(w1, w2)
{
   if (w1 != w2)
   {
      var iW1 = 1 / w1;
      var iW2 = 1 / w2;
      var iDW = 1 / (w2 - w1);
      
      this.findT = function(t)
         {
            var w = 1 / lerp(iW1, iW2, t);
            // Return an array with the new t AND w value
            return [(w - w1) * iDW, w];
         }
   }
   else
   {
      this.findT = function(t)
         {
            return [t, w1];
         }
   }
}

RenderEngine.prototype.drawLine = function(P1, P2, fragmentShader, storeVals)
{
   // Decide how far we want to loop by taking the max distance along x and y locations
   // Remember, screen coordinates are held in [0] and varying values are held in [1]
   var maxDist = Math.max(Math.abs(P1[0][0] - P2[0][0]),
                          Math.abs(P1[0][1] - P2[0][1]));

   // Draw the first point
   var varsP1 = fragmentShader.main(P1[1]);
   this.renderBuffer.setPixel(P1[0][0], P1[0][1], varsP1);
   
   // Keep this value around for triangle drawing
   // Based on the Y position, store the x position,
   // the varying vals, and the w value.
   if (storeVals != null)
   {
      storeVals[P1[0][1]] = [P1[0][0], varsP1, P1[0][3]];
   }
   
   // Note that maxDist should be an integer value,
   // a distance between the rounded P1 and P2 screen positions.
   // Watch for them being on top of each other by checking the value
   if (maxDist > 1)
   {
      // Keep track of something we can increment for t
      var incT = 1 / maxDist;
      var t = 0;
      
      // Use this little tool for finding a special t for w
      var twFind = new TwFinder(P1[0][3], P2[0][3]);  
      
      for (var i = 1; i < maxDist; i++)
      {
         // Smoothly interpolate all values based on the t value 
         t += incT;
         
         // Adjust t for depth for the color interpolations
         var Tw = twFind.findT(t);
         
         // X and Y values are rounded so we always use integers
         // Use the regular t for the X and Y positions
         var x = Math.round(lerp(P1[0][0], P2[0][0], t));
         var y = Math.round(lerp(P1[0][1], P2[0][1], t));
         
         // Find the varying values
         var varyingVars = new Array();
         for (var j = 0; j < P1[1].length; j++)
         {
            varyingVars[j] = lerp(P1[1][j], P2[1][j], Tw[0]);
         }

         // Get color from the fragment shader with these interpolated values
         var color = fragmentShader.main(varyingVars);
         
         // Finally set the pixel
         this.renderBuffer.setPixel(x, y, varyingVars);

         // Keep this value around for triangle drawing,
         // the current x, varying values, and w value
         // (from our calculated Tw)
         if (storeVals != null)
         {
            storeVals[y] = [x, varyingVars, Tw[1]];
         }
      }
   }
   
   // Draw the end-point
   var varsP2 = fragmentShader.main(P2[1]);
   this.renderBuffer.setPixel(P2[0][0], P2[0][1], varsP2);
   
   // Keep this value around for triangle drawing
   // Based on the Y position, store the x position,
   // the varying vals, and the w value.
   if (storeVals != null)
   {
      storeVals[P2[0][1]] = [P2[0][0], varsP2, P2[0][3]];
   }
}

// Used to sort elements in a triangle
// Y should be less or X should be less if Y is the same
isPosAboveInTri = function(P1, P2)
{
   if (P1[1] < P2[1])
   {
      return true;
   }
   else if (P1[1] == P2[1])
   {
      return (P1[0] < P2[0]);
   }
   else
   {
      return false;
   }
}

checkOrderAndSwapIfNeeded = function(vertArray, orderedIndex, leftIndex, rightIndex)
{
   if (!isPosAboveInTri(vertArray[orderedIndex[leftIndex]][0],
                        vertArray[orderedIndex[rightIndex]][0]))
   {
      var temp = orderedIndex[leftIndex];
      orderedIndex[leftIndex] = orderedIndex[rightIndex];
      orderedIndex[rightIndex] = temp;
      return true;
   }
   else
   {
      return false;
   }
}

// drawLineOnSide
//   draw a line and stores the values [x, varying] at each y value
// For lines on the left side of the triangle,
// we want to draw the line such that the last values placed in the
// storeVals array are the ones with the greatest x value.
// For lines on the right side, we want to draw the line so that the
// values placed in the storeVals array are the ones with the smallest x value.
// To do that, we may need to flip the order of P1 and P2.
// side tells us whether we are on the left or right side:
// side is +1 on the left side and -1 on the right side
RenderEngine.prototype.drawLineOnSide = function(P1, P2, fragmentShader,
                                                 storeVals, side)
{
   var dX = P2[0][0] - P1[0][0];
   if (dX * side < 0)
   {
      // The points are in the wrong order
      this.drawLine(P2, P1, fragmentShader, storeVals);
   }
   else
   {
      // The points are in the right order
      this.drawLine(P1, P2, fragmentShader, storeVals);
   }
}

RenderEngine.prototype.drawTriangle = function(vertArray, fragmentShader)
{
   // ASSERT: We know the 3 points are not on a line,
   // so they must have different Y values 
   // Order the three verts from top to bottom
   var orderedIndex = [0, 1, 2];
   checkOrderAndSwapIfNeeded(vertArray, orderedIndex, 0, 1);
   if (checkOrderAndSwapIfNeeded(vertArray, orderedIndex, 1, 2))
   {
      // Only check again if we needed to swap the second one
      checkOrderAndSwapIfNeeded(vertArray, orderedIndex, 0, 1);
   }
   
   // Hold on to position and varying values from
   // the left side and the right side
   var leftHold = new Array();
   var rightHold = new Array();
   
   // We need to draw all three lines, either on the left side or on the right side
   var top = vertArray[orderedIndex[0]][0];
   var mid = vertArray[orderedIndex[1]][0];
   var bottom = vertArray[orderedIndex[2]][0];
   var tY = (mid[1] - top[1]) / (bottom[1] - top[1]);
   var interceptX = lerp(top[0], bottom[0], tY);
   if (mid[0] < interceptX)
   {
      // The middle point is on the left, draw 2 lines on the left and one on the right
      this.drawLineOnSide(vertArray[orderedIndex[0]],
                          vertArray[orderedIndex[1]],
                          fragmentShader, leftHold, +1);
      this.drawLineOnSide(vertArray[orderedIndex[1]],
                          vertArray[orderedIndex[2]],
                          fragmentShader, leftHold, +1);
      this.drawLineOnSide(vertArray[orderedIndex[0]],
                          vertArray[orderedIndex[2]],
                          fragmentShader, rightHold, -1);
   }
   else
   {
      // The middle point is on the right, draw 2 lines on the right and one on the left
      this.drawLineOnSide(vertArray[orderedIndex[0]],
                          vertArray[orderedIndex[1]],
                          fragmentShader, rightHold, -1);
      this.drawLineOnSide(vertArray[orderedIndex[1]],
                          vertArray[orderedIndex[2]],
                          fragmentShader, rightHold, -1);
      this.drawLineOnSide(vertArray[orderedIndex[0]],
                          vertArray[orderedIndex[2]],
                          fragmentShader, leftHold, +1);
   }
   
   // Now we can fill in the scanlines between the left and right sides
   var topY = top[1];
   var bottomY = bottom[1];
   var varyingVars = new Array();
   
   // We will not need to do the top or bottom scanlines, they should already be done
   for (var y = topY + 1; y < bottomY; y++)
   {
      var leftX = leftHold[y][0];
      var rightX = rightHold[y][0];
      if (rightX > leftX + 1)
      {
         // We only need to do something if there is space between the two
         // Note that we COULD just draw a line here,
         // but since we know we are on scan lines we can optimize a bit.
         var scanLine = this.renderBuffer.getScanLine(y);         
         var leftVars = leftHold[y][1];
         var rightVars = rightHold[y][1];
         var incT = 1 / (rightX - leftX);
         var tX = incT;

         // Use this little tool for finding a special t for w
         var twFind = new TwFinder(leftHold[y][2], rightHold[y][2]);
         for (var x = leftX + 1; x < rightX; x++)
         {
            // Adjust t for depth for the color interpolations
            var tW = twFind.findT(tX)[0];          

            // Find the varying values
            for (var j = 0; j < leftVars.length; j++)
            {
               varyingVars[j] = lerp(leftVars[j], rightVars[j], tW);
            }
            
            tX += incT;
               
            // Get color from the fragment shader with these interpolated values
            var color = fragmentShader.main(varyingVars);
            
            // Finally set the pixel
            this.renderBuffer.setPixel(x, y, varyingVars);
         }
      }
   }
}

RenderEngine.prototype.processVerts = function(verts, vertexShader,
                                               translatedVerts, varyingVars)
{
   // Walk through the vertex shader for every vertex and keep the values
   for (var i = 0; i < verts.length; i++)
   {
      // Push the NDC coordinates and the smooth variables for each
      translatedVerts.push(vertexShader.main(verts[i]));
      varyingVars.push(vertexShader.getSmoothVars(verts[i]));
   }
}

// Provide a points array
RenderEngine.prototype.clipLineToPlane = function(pts, plane)
{
   var outIdx = -1;
   if (plane.pointInPlane(pts[0][0]) < 0)
   {
      outIdx = 0;
   }
   if (plane.pointInPlane(pts[1][0]) < 0)
   {
      if (outIdx == 0)
      {
         return false;
      }
      outIdx = 1;
   }
   if (outIdx >= 0)
   {
      // Replace one of the points
      pts[outIdx] = findIntersectVertex(plane, pts[0], pts[1]);
   }
   return true; // We can draw SOME part of the line
}

RenderEngine.prototype.clipLine = function(P1, P2, fragmentShader)
{
   var clippedLine = [P1, P2];
   for (var clipIdx = 0; clipIdx < clipPlanes.length; clipIdx++)
   {
      if (!this.clipLineToPlane(clippedLine, clipPlanes[clipIdx]))
      {
         return; // Clipped out
      }
   }
   clippedLine[0][0] = this.ndc2screen(clippedLine[0][0]);
   clippedLine[1][0] = this.ndc2screen(clippedLine[1][0]);
   this.drawLine(clippedLine[0], clippedLine[1], fragmentShader);
}

RenderEngine.prototype.drawLines = function(verts, indexList,
                                            vertexShader, fragmentShader)
{
   // Translate all of the verts
   var translatedVerts = new Array();
   var varyingVars = new Array();
   this.processVerts(verts, vertexShader, translatedVerts, varyingVars);

   // Loop through the indexList in pairs to draw the lines
   for (var i = 0; i < indexList.length; i += 2)
   {
      var P1 = [translatedVerts[indexList[i + 0]],
                    varyingVars[indexList[i + 0]]];
      var P2 = [translatedVerts[indexList[i + 1]],
                    varyingVars[indexList[i + 1]]];

      this.clipLine(P1, P2, fragmentShader);
   }
}

RenderEngine.prototype.clipPolygonAgainstPlane = function(poly, plane)
{
   // Check to see if there are any there
   if (poly.length == 0)
   {
      return poly;
   }  

   var remainingPoly = [];
   // We have to start somewhere
   // Are we starting in or out?
   var wasIn = (plane.pointInPlane(poly[0][0]) > 0);
   if (wasIn)
   {
      // This vertex is good to draw
      remainingPoly.push(poly[0]);
   }
   
   for (var vertIdx = 1; vertIdx <= poly.length; vertIdx++)
   {
      var isIn = (plane.pointInPlane(poly[vertIdx % poly.length][0]) > 0);
      if (wasIn)
      {
         if (isIn)
         {
            // do not add 0 twice
            if (vertIdx != poly.length)
            {
               // This vertex is good to draw
               remainingPoly.push(poly[vertIdx]);
            }
         }
         else
         {
            // We are going from in to out, find the intersection and add that            
            remainingPoly.push(findIntersectVertex(plane, poly[vertIdx - 1],
                                                   poly[vertIdx % poly.length]));
         }
      }
      else
      {
         // The last point was NOT in
         if (isIn)
         {
            // Do the intersection first
            remainingPoly.push(findIntersectVertex(plane, poly[vertIdx - 1],
                                                   poly[vertIdx % poly.length]));
            
            // Then add the new point, only do not add 0 twice
            if (vertIdx != poly.length)
            {
               // This vertex is good to draw
               remainingPoly.push(poly[vertIdx]);
            }
         }
      }
      
      // Ready for the next iteration
      wasIn = isIn;
   }
   return remainingPoly;
}

RenderEngine.prototype.clipPolygon = function(poly)
{
   var remainingPoly = poly;
   for (var clipIdx = 0; clipIdx < clipPlanes.length; clipIdx++)
   {
      remainingPoly = this.clipPolygonAgainstPlane(remainingPoly,
                                                   clipPlanes[clipIdx]);
   }
   return remainingPoly;
}

RenderEngine.prototype.checkDrawTriangle = function(vertArray, winding,
                                                    fragmentShader)
{
   var polygon = this.clipPolygon(vertArray);
   
   // If they were all clipped away, there would be nothing left
   for (var idx = 2; idx < polygon.length; idx++)
   {
      var triangle = [
         [this.ndc2screen(polygon[0][0]), polygon[0][1]],
         [this.ndc2screen(polygon[idx - 1][0]), polygon[idx - 1][1]],
         [this.ndc2screen(polygon[idx][0]), polygon[idx][1]]
      ];

      // Determine if we should draw this triangle at all
      var A = vectorSubtract(triangle[0][0], triangle[1][0]);
      var B = vectorSubtract(triangle[2][0], triangle[1][0]);
   
      // If the points are all on a line, or if either A or B is 0 length,
      // the crossProduct should be 0, so don't draw it
      var crossProduct = vectorCross(A, B);
      if ((crossProduct[2] * winding) < 0)
      {
         return;
      }

      this.drawTriangle(triangle, fragmentShader);
   }
}

var clockwiseWinding = -1;

var counterClockwiseWinding = +1;

RenderEngine.prototype.drawTriangles = function(verts, indexList, winding,
                                                vertexShader, fragmentShader)
{
   // Translate all of the verts
   var translatedVerts = new Array();
   var varyingVars = new Array();
   this.processVerts(verts, vertexShader, translatedVerts, varyingVars);
   
   // Loop through the indexList in triples to draw the lines
   for (var i = 0; i < indexList.length; i += 3)
   {
      var vertArray = [
         [translatedVerts[indexList[i + 0]],
              varyingVars[indexList[i + 0]]],
         [translatedVerts[indexList[i + 1]],
             varyingVars[indexList[i + 1]]],
         [translatedVerts[indexList[i + 2]],
             varyingVars[indexList[i + 2]]]
         ];
      
      this.checkDrawTriangle(vertArray, winding, fragmentShader);
   }
}
