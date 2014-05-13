//   NOTE that in this and the BasicColorFragmentShader
//   it is unnecessary to store positionIdx (or colorIdx)
//   as a "class member" property, e.g.,   
//   this.positionIdx = positionIdx;
//   because of the "closures" defined by
//   the functions assigned to this.main in each class.
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
