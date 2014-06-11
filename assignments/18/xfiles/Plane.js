// Plane needs MatrixMath
// Plane is needed by RenderEngine

function Plane(P, N)
{
   this.P = P;
   this.N = N;
}

// Returns POSITIVE for IN, NEGATIVE for OUT, 0 for ON.
Plane.prototype.pointInPlane = function(A)
{
   return vectorDot(vectorSubtract(A, this.P), this.N);
}

// Returns the t value.
// Assert that A and B are not the same and are not BOTH on the plane.
Plane.prototype.lineIntersect = function(A, B)
{
   var num = vectorDot(vectorSubtract(this.P, A), this.N);
   var den = vectorDot(vectorSubtract(B, A), this.N);
   return (num / den);
}

var clipPlanes = [
   // near clip plane pointing away   
   new Plane([0, 0, -1, 0], [0, 0, +1, 0]),
   // far clip plane pointing back
   new Plane([0, 0, +1, 0], [0, 0, -1, 0]),
   // the other 4 all intersect at 0, 0, 0, 0 in 4 space,
   // the w is 0. The N shows what the direction is.
   new Plane([0, 0, 0, 0], [+1,  0, 0, 1]), // left clip 
   new Plane([0, 0, 0, 0], [-1,  0, 0, 1]), // right clip
   new Plane([0, 0, 0, 0], [ 0, +1, 0, 1]), // bottom clip
   new Plane([0, 0, 0, 0], [ 0, -1, 0, 1])  // top clip
];

// Assert that A is out OR B is out
findIntersectVertex = function(plane, A, B)
{
   var t = plane.lineIntersect(A[0], B[0]);
            
   // Interpolate
   var newPt = [[], []];
   for (var i = 0; i < 2; i++)
   {
      for (var j = 0; j < A[i].length; j++)
      {
         newPt[i][j] = lerp(A[i][j], B[i][j], t);
      }
   }
   return newPt;
}
