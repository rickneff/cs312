function MatrixTransformShader(positionIdx, matrix)
{
   this.main = function(vertex)
      {
         return matrixPostMult(matrix, vertex[positionIdx]);
      }
}
