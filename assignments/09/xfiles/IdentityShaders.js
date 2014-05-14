function IdentityVertexShader(positionIdx)
{
   this.main = function(vertex)
      {
         return vertex[positionIdx];
      }
}

function BasicColorFragmentShader(colorIdx)
{
   this.main = function(vertex)
      {
         return vertex[colorIdx];
      }
}
