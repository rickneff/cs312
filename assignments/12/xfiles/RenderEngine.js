// This file now depends on the lerp function defined in MatrixMath.js

function RenderEngine(renderBuffer)
{
   this.renderBuffer = renderBuffer;
}

// x: -1 => 0,     +1 => w - 1
// y: -1 => h - 1, +1 => 0
// Note where the rounding is now being done
RenderEngine.prototype.ndc2screen = function(ndcPos)
{
   return [
      Math.round((ndcPos[0] + 1.0) * (this.renderBuffer.width - 1) * 0.5),
      Math.round((1.0 - ndcPos[1]) * (this.renderBuffer.height - 1) * 0.5)
   ];
}

RenderEngine.prototype.drawPoints = function(verts,
                                             vertexShader,
                                             fragmentShader)
{
   for (var i = 0; i < verts.length; i++)
   {
      var screenPos = this.ndc2screen(vertexShader.main(verts[i]));
      var color = fragmentShader.main(vertexShader.getSmoothVars(verts[i]));
      this.renderBuffer.setPixel(screenPos[0], screenPos[1], color);
   }
}

RenderEngine.prototype.drawLine = function(P1, P2, fragmentShader)
{
   // Decide how far we want to loop by taking
   // the max distance along x and y locations
   // Remember, screen coordinates are held in [0] and
   // varying values are held in [1]
   var maxDist = Math.max(Math.abs(P1[0][0] - P2[0][0]),
                          Math.abs(P1[0][1] - P2[0][1]));
   
   // Note that maxDist should be an integer value,
   // a distance between the rounded P1 and P2 screen positions.
   // Watch for them being on top of each other by checking the value.
   // If they are on top of each other, maxDist will be <= 1
   // and nothing will be drawn in between them.
   if (maxDist > 1)
   {
      // We can reuse this varying list of interpolated values
      var incT = 1 / maxDist;
      var t = 0;
      var varyingVars = new Array();
      for (var i = 1; i < maxDist; i++)
      {
         // Smoothly interpolate all values based on the t value 
         t += incT;
         
         // x and y values are rounded so we always use integers
         var x = Math.round(lerp(P1[0][0], P2[0][0], t));
         var y = Math.round(lerp(P1[0][1], P2[0][1], t));
         
         // Find the varying values
         for (var j = 0; j < P1[1].length; j++)
         {
            varyingVars[j] = lerp(P1[1][j], P2[1][j], t);
         }
         
         // Get the color from the fragment shader
         // with these interpolated values
         var color = fragmentShader.main(varyingVars);
         
         // Finally set the pixel
         this.renderBuffer.setPixel(x, y, color);
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
      translatedVerts.push(this.ndc2screen(vertexShader.main(verts[i])));
      varyingVars.push(vertexShader.getSmoothVars(verts[i]));
   }
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
      this.drawLine(P1, P2, fragmentShader);
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

RenderEngine.prototype.drawTriangle = function(vertArray, fragmentShader)
{
   // For now, just draw the triangle by drawing the 3 lines
   this.drawLine(vertArray[0], vertArray[1], fragmentShader);
   this.drawLine(vertArray[2], vertArray[1], fragmentShader);
   this.drawLine(vertArray[0], vertArray[2], fragmentShader);
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
   
   // Loop through the indexList in tris to draw the lines
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

