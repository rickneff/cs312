function MatrixSmoothVertShader(positionIdx, colorIdx, matrix)
{
   this.main = function(vertex)
      {
         return matrixXvector(matrix, vertex[positionIdx]);
      }

   this.getSmoothVars = function(vertex)
      {
         // We will have one smoothly varying variable, the color of the vertex
         return vertex[colorIdx];
      }
}

function SmoothColorFragShader()
{
   this.main = function(varyingVars)
      {
         // Yes, the fragment shader is now coupled to the vertex shader.
         // :(  Oh well. ALL we can know here is the varyingVars passed
         // from the vertex shader.
         // This fragment shader knows that the vertex shader left the
         // color information for it in the first varying value
         // (the first 4 values in the array)
         return varyingVars;
      }
}
