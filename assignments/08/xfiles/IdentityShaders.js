function IdentityVertexShader(positionIdx)
{
//   this.positionIdx = positionIdx;
   
   this.main = function(vertex)
      {
         return vertex[positionIdx];
      }
}

function BasicColorFragmentShader(colorIdx)
{
//   this.colorIdx = colorIdx;
   
   this.main = function(vertex)
      {
         return vertex[colorIdx];
      }
}
