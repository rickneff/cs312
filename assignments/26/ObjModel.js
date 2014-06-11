function ObjModel(modelData)
{
   this.boundRadius = 0;
   
   var findNextVertPos = function(faceVert, readFaceVerts)
      {
         var len = readFaceVerts.length;
         for (var i = 0; i < len; i++)
         {
            if (faceVert == readFaceVerts[i])
            {
               return i;
            }
         }
         // we did not find it, make a new vert
         readFaceVerts.push(faceVert);
         return len;
      }
   
   var readV = [];
   var readVN = [];
   var readVT = [];
   var readFaceVerts = [];
   var idx = [];
   var re = /\s+/;
   
   for (var lineIdx = 0; lineIdx < modelData.length; lineIdx++)
   {
      var line = modelData[lineIdx].split(re);
      
      // Read through the data
      if (line[0] == "v")
      {
         readV.push(line[1], line[2], line[3]);
      }
      else if (line[0] == "vt")
      {
         readVT.push(line[1], line[2]);
      }
      else if (line[0] == "vn")
      {
         readVN.push(line[1], line[2], line[3]);
      }
      else if (line[0] == "f")
      {
         // the obj file has things wound ccw, we want to use cw
         for (var faceIdx = line.length - 1; faceIdx >= 1; faceIdx--)
         {
            idx.push(findNextVertPos(line[faceIdx], readFaceVerts));
         }
      }
   }
   
   // Create my arrays
   var numVerts = readFaceVerts.length;
   this.locations = new Float32Array(numVerts * 3);
   this.norms = new Float32Array(numVerts * 3);
   this.UVs= new Float32Array(numVerts * 2);
   this.idxList= new Uint16Array(idx);
   
   // Loop through the faceVerts read in to populate the locations, normals, and uv's
   for (var i = 0; i < readFaceVerts.length; i++)
   {
      var readFaceVert = readFaceVerts[i].split("/");
      var vID = (readFaceVert[0] - 1) * 3; // all are 1 indexed
      var tID = (readFaceVert[1] - 1) * 2;
      var nID = (readFaceVert[2] - 1) * 3;
      var vertPos = [readV[vID + 0], readV[vID + 1], readV[vID + 2]];
      var vertRadSq = vertPos[0] * vertPos[0] +
         vertPos[1] * vertPos[1] + vertPos[2] *vertPos[2];
      if (this.boundRadius < vertRadSq)
      {
         this.boundRadius = vertRadSq;
      }
      this.locations.set(vertPos, i * 3);
      this.norms.set([readVN[nID + 0], readVN[nID + 1],
                      readVN[nID + 2]], i * 3);
      this.UVs.set([readVT[tID + 0], readVT[tID + 1]], i * 2);
   }
   
   // We have been waiting to do the sqrt one time
   this.boundRadius = Math.sqrt(this.boundRadius);
}
