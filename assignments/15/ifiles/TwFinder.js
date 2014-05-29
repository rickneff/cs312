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

// SAMPLE USAGE:
      // Keep track of something we can increment for t
//    var incT = 1 / maxDist;
//    var t = 0;
      
      // Use this little tool for finding a special t for w
//    var twFind = new TwFinder(P1[0][3], P2[0][3]);  
      
//    for (var i = 1; i < maxDist; i++)
//    {
         // Smoothly interpolate all values based on the t value 
//       t += incT;
         
         // Adjust t for depth for the color interpolations
//       var Tw = twFind.findT(t);
         
         // X and Y values are rounded so we always use integers
         // Use the regular t for the X and Y positions
//       var x = Math.round(lerp(P1[0][0], P2[0][0], t));
//       var y = Math.round(lerp(P1[0][1], P2[0][1], t));
         
         // Find the varying values
//       var varyingVars = new Array();
//       for (var j = 0; j < P1[1].length; j++)
//       {
//          varyingVars[j] = lerp(P1[1][j], P2[1][j], Tw[0]);
//       }

         // Get color from the fragment shader with these interpolated values
//       var color = fragmentShader.main(varyingVars);
         
         // Finally set the pixel
//       this.renderBuffer.setPixel(x, y, varyingVars);

         // Keep this value around for triangle drawing,
         // the current x, varying values, and w value
         // (from our calculated Tw)
//       if (storeVals != null)
//       {
//          storeVals[y] = [x, varyingVars, Tw[1]];
//       }
//    }
