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

TranslateMatrix = function(tX, tY, tZ)
{
   return [
      1, 0, 0, tX,
      0, 1, 0, tY,
      0, 0, 1, tZ,
      0, 0, 0, 1
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

// Normalize in place and return true if it worked.
// Will fail if length is 0.
vectorNormalize = function(V)
{
   var len = vectorLength(V);
   if (len > 0.000001)
   {
      var iLen = 1/len;
      V[0] *= iLen; V[1] *= iLen; V[2] *= iLen; V[3] *= iLen;
      return true;
   }
   else
   {
      return false;
   }
}
