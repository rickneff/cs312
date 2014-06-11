function Sphere(numLats, numLons)
{
   // How many verts are we going to need?
   var numVerts = ((numLats + 1) * (numLons + 1));
   var numTris  = ((numLats - 1) * (numLons * 2));

   // pre-allocate to help with speed
   this.locations = new Float32Array(numVerts * 3);
   this.UVs= new Float32Array(numVerts * 2);
   this.idxList= new Uint16Array(numTris * 3);
        
   this.setvert = function(idx, vertPos, uv)
      {
         this.locations.set(vertPos, idx * 3);
         this.UVs.set(uv, idx * 2);
      }
        
   this.setTri = function(idx, triIndexes)
      {
         this.idxList.set(triIndexes, idx * 3);
      }
        
   var currVertIdx = 0;
   var currTriIdx = 0;
   var radsPerLat = Math.PI / numLats;
   var radsPerLon = (2 * Math.PI) / numLons;
        
   for (var lat = 0; lat <= numLats; lat++)
   {
      var currAngleFromNorthPole = radsPerLat * lat;
      var y = Math.cos(currAngleFromNorthPole);
      var xz = Math.sin(currAngleFromNorthPole);
      var v = 1 - (lat / numLats);
        
      for (var lon = 0; lon < numLons; lon++)
      {
         var currAngleFromPM = radsPerLon * lon;
         var z = -xz * Math.sin(currAngleFromPM);
         var x = xz * Math.cos(currAngleFromPM);
         var u = lon / numLons;
                        
         // Create the triangles if not at the pole
         if ((lat != 0) && (lat != numLats))
         {
            // there are 4 per vertex here
            var myVertPos = currVertIdx;
            var right = myVertPos + 1;
            var above = myVertPos - (numLons + 1);
            var below = right + (numLons + 1);
                                
            this.setTri(currTriIdx++, [myVertPos, above, right]);
            this.setTri(currTriIdx++, [myVertPos, right, below]);
         }
                        
         this.setvert(currVertIdx++, [x, y, z], [u, v]);
      }
                
      // One last wrap around point
      this.setvert(currVertIdx++, [xz, y, 0], [1, v]);
   }
        
   // Just a litte error checking
   if (numVerts != currVertIdx)
   {
      alert("numVerts = " + numVerts + ", currVertIdx = " + currVertIdx);
   }
        
   if (numTris != currTriIdx)
   {
      alert("numTris = " + numTris + ", currTriIdx = " + currTriIdx);
   }

   // Our normals array is precisely our locations because we are on a unit sphere (yeah!)
   this.normals = this.locations;
}
