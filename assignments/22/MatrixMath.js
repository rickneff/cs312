// Make a vec4 by post-multiplying the matrix by the vector
matrixXvector = function(m, v)
{
   return [
      m[ 0] * v[0] + m[ 1] * v[1] + m[ 2] * v[2] + m[ 3] * v[3], 
      m[ 4] * v[0] + m[ 5] * v[1] + m[ 6] * v[2] + m[ 7] * v[3],
      m[ 8] * v[0] + m[ 9] * v[1] + m[10] * v[2] + m[11] * v[3],
      m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3]
      ];
}

matrixXmatrix = function(m1, m2)
{
   var c1 = matrixXvector(m1, [m2[ 0], m2[ 4], m2[ 8], m2[12]]);
   var c2 = matrixXvector(m1, [m2[ 1], m2[ 5], m2[ 9], m2[13]]);
   var c3 = matrixXvector(m1, [m2[ 2], m2[ 6], m2[10], m2[14]]);
   var c4 = matrixXvector(m1, [m2[ 3], m2[ 7], m2[11], m2[15]]);
   
   return [
      c1[0], c2[0], c3[0], c4[0],
      c1[1], c2[1], c3[1], c4[1],
      c1[2], c2[2], c3[2], c4[2],
      c1[3], c2[3], c3[3], c4[3]
   ];
}

chainMultMat = function()
{
   var M = arguments[0];
   for (var i = 1; i < arguments.length; i++)
   {
      M = matrixXmatrix(M, arguments[i]);
   }
   return M;
}

TranslateMatrix = function(tX, tY, tZ)
{
   return [
      1, 0, 0, tX,
      0, 1, 0, tY,
      0, 0, 1, tZ,
      0, 0, 0, 1
   ];
}

TranslateMatrixWithVector = function(t)
{
   return TranslateMatrix(t[0], t[1], t[2]);
}

ScaleMatrix = function(sX, sY, sZ)
{
   return [
      sX, 0, 0, 0, 
      0, sY, 0, 0,
      0, 0, sZ, 0,
      0, 0, 0,  1
   ];
}

ScaleMatrixWithVector = function(s)
{
   return ScaleMatrix(s[0], s[1], s[2]);
}

IdentityMatrix = function()
{
   return [
      1, 0, 0, 0,
      0, 1, 0, 0, 
      0, 0, 1, 0, 
      0, 0, 0, 1
   ];
}

rotateY = function(a)
{
   var c = Math.cos(a);
   var s = Math.sin(a);
   return [
      +c, 0, +s, 0,
       0, 1,  0, 0,
      -s, 0, +c, 0,
       0, 0,  0, 1
   ];
}

rotateX = function(a)
{
   var c = Math.cos(a);
   var s = Math.sin(a);
   return [
      +c, -s, 0, 0,
      +s, +c, 0, 0,
       0,  0, 1, 0,
       0,  0, 0, 1
   ];
}  

rotateZ = function(a)
{
   var c = Math.cos(a);
   var s = Math.sin(a);
   return [
      1,  0,  0, 0,
      0, +c, -s, 0,
      0, +s, +c, 0,
      0,  0,  0, 1
   ];
}

RotateEulerWithVector = function(eulerRot)
{
   return chainMultMat(rotateY(eulerRot[1]),
                       rotateX(eulerRot[0]),
                       rotateZ(eulerRot[2]));
}

transpose = function(M)
{
   return [
      M[0], M[4], M[ 8], M[12],
      M[1], M[5], M[ 9], M[13],
      M[2], M[6], M[10], M[14],
      M[3], M[7], M[11], M[15]
   ];
}

getTranslateVecFromMatrix = function(M)
{
   return [M[3], M[7], M[11], M[15]];
}

getRotationMatrixFromMatrix = function(M)
{
   return [
      M[0], M[1],  M[2], 0,
      M[4], M[5],  M[6], 0,
      M[8], M[9], M[10], 0,
      0,     0,    0,    1
   ];
}

lerp = function(A, B, t)
{
   return (B - A) * t + A;
}

vectorAdd = function(A, B)
{
   return [
      A[0] + B[0], A[1] + B[1], A[2] + B[2], A[3] + B[3]
   ];
}

vectorSubtract = function(A, B)
{
   return [
      A[0] - B[0], A[1] - B[1], A[2] - B[2], A[3] - B[3]
   ];
}

vectorMult = function(A, s)
{
   return [
      A[0] * s, A[1] * s, A[2] * s, A[3] * s
   ];
}

// Note that this one ONLY does a 3D cross product
vectorCross = function(A, B)
{
   return [
      A[1] * B[2] - A[2] * B[1],
      A[2] * B[0] - A[0] * B[2],
      A[0] * B[1] - A[1] * B[0]
      ];
}

vectorDot = function(A, B)
{
   return A[0] * B[0] + A[1] * B[1] + A[2] * B[2] + A[3] * B[3];
}

vectorLength = function(V)
{
   return Math.sqrt(vectorDot(V, V));
}

// Normalize and return a vector. Will return V if length is 0.
vectorNormalize = function(V, ignore4)
{
   var len = vectorLength(ignore4 ? [V[0], V[1], V[2], 0] : V);
   if (len > 0.000001)
   {
      var iLen = 1/len;
      return [V[0] * iLen, V[1] * iLen, V[2] * iLen,
              ignore4 ? V[3] : V[3] * iLen];
   }
   else
   {
      return V;
   }
}

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
