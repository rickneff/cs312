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

RenderEngine.prototype.drawLine = function(P1, P2, fragmentShader)
{
   var point;
   var line = new Line(P1, P2, fragmentShader);
   var maxDist = line.getMaxDist();

   if (maxDist > 1)
   {
      for (var i = 1; i < maxDist; i++)
      {
         // increment the point on the line, then set the pixel
         point = line.nextPoint();

         this.renderBuffer.setPixel(point[0][0], point[0][1], point[1]);
      }
   }
   
   // Draw the 2 end-points
   this.renderBuffer.setPixel(P1[0][0], P1[0][1], fragmentShader.main(P1[1]));
   this.renderBuffer.setPixel(P2[0][0], P2[0][1], fragmentShader.main(P2[1]));
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

RenderEngine.prototype.checkDrawTriangle = function(vertArray, winding,
                                                    fragmentShader)
{
   // Determine if we should draw this triangle at all
   var A = vectorSubtract(vertArray[0][0], vertArray[1][0]);
   var B = vectorSubtract(vertArray[2][0], vertArray[1][0]);
   
   // If the points are all on a line, or if either A or B is 0 length,
   // the crossProduct should be 0, so don't draw it
   var crossProduct = vectorCross(A, B);
   if ((crossProduct[2] * winding) > 0)
   {
      this.drawTriangle(vertArray, fragmentShader);
   }
}

RenderEngine.prototype.sortTriangle = function(vertArray)
{
   var low;
   var high;
   var mid = vertArray[2];

   if (vertArray[0][0][1] <= vertArray[1][0][1])
   {
      low = vertArray[0];
      high = vertArray[1];
   }
   else
   {
      low = vertArray[1];
      high = vertArray[0];
   }

   if (low[0][1] > vertArray[2][0][1])
   {
      mid = low;
      low = vertArray[2];
   }
   else if (high[0][1] <= vertArray[2][0][1])
   {
      mid = high;
      high = vertArray[2];
   }
    
   vertArray[0] = low;
   vertArray[1] = mid;
   vertArray[2] = high;
}

RenderEngine.prototype.drawTriangle = function(vertArray, fragmentShader)
{
   var lineL;
   var lineS;
   var pointL;
   var pointS;
   var maxDistL;
   var maxDist1;
   var maxDist2;

   this.sortTriangle(vertArray);

   lineL = new Line(vertArray[0], vertArray[2], fragmentShader);
   lineS = new Line(vertArray[0], vertArray[1], fragmentShader);

   maxDistL = lineL.getMaxDist();
   maxDist1 = lineS.getMaxDist();
   maxDist2 = Math.max(Math.abs(vertArray[1][0][0] -
                                vertArray[2][0][0]),
                       Math.abs(vertArray[1][0][1] -
                                vertArray[2][0][1]));

   if (maxDistL > 1 && maxDist1 > 1 && maxDist2 > 1)
   {
      // loop through pixels of the large line
      for (var i = 1; i <= maxDistL; i++)
      {
         pointL = lineL.nextPoint();
         // loop through pixels of the small line until the y value of the
         // large line is reached
         while (lineS.getY() < lineL.getY())
         {
            // if the end of the first small line is reached,
            // switch to second small line
            if (lineS.getEOL() == true)
            {
               lineS = new Line(vertArray[1], vertArray[2], fragmentShader);
            }

            pointS = lineS.nextPoint();
            this.renderBuffer.setPixel(pointS[0][0], pointS[0][1], pointS[1]);
         }

         // takes the two points found (with equal y values) on the screen
         // and displays them using drawLine()
         this.drawLine(pointL, pointS, fragmentShader);
      }
   }

   // display the three vertices of the triangle using setPixel()
   this.renderBuffer.setPixel(vertArray[0][0][0], vertArray[0][0][1],
                              fragmentShader.main(vertArray[0][1]));
   this.renderBuffer.setPixel(vertArray[1][0][0], vertArray[1][0][1],
                              fragmentShader.main(vertArray[1][1]));
   this.renderBuffer.setPixel(vertArray[2][0][0], vertArray[2][0][1],
                              fragmentShader.main(vertArray[2][1]));
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
