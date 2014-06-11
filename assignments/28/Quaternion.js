// all quaternion functions are based on
// http://www.cs.princeton.edu/~gewang/projects/darth/stuff/quat_faq.html#Q47
// depends on vectorLength function found in MatrixMath.js
function Quaternion()
{
   this.x = 0.0;
   this.y = 0.0;
   this.z = 0.0;
   this.w = 1.0;
   if (arguments.length == 4)
   {
      this.x = arguments[0];
      this.y = arguments[1];
      this.z = arguments[2];
      this.w = arguments[3];
   }
        
   this.getInverse = function()
      {
         return new Quaternion(-this.x, -this.y, -this.z, this.w);
      }
        
   this.getMagnitude = function()
      {
         return vectorLength([this.x, this.y, this.z, this.w]);
      }
        
   this.normalize = function()
      {
         var iLen = 1.0 / this.getMagnitude();
         this.x *= iLen;
         this.y *= iLen;
         this.z *= iLen;
         this.w *= iLen;
      }
        
   this.getMatrix = function()
      {
         var xx = this.x * this.x;
         var xy = this.x * this.y;
         var xz = this.x * this.z;
         var xw = this.x * this.w;

         var yy = this.y * this.y;
         var yz = this.y * this.z;
         var yw = this.y * this.w;

         var zz = this.z * this.z;
         var zw = this.z * this.w;
                
         var mat = IdentityMatrix();

         mat[ 0] = 1 - 2 * (yy + zz);
         mat[ 4] =     2 * (xy - zw);
         mat[ 8] =     2 * (xz + yw);

         mat[ 1] =     2 * (xy + zw);
         mat[ 5] = 1 - 2 * (xx + zz);
         mat[ 9] =     2 * (yz - xw);

         mat[ 2] =     2 * (xz - yw);
         mat[ 6] =     2 * (yz + xw);
         mat[10] = 1 - 2 * (xx + yy);
                
         return mat;
      }
}

quatMult = function(Q1,Q2)
{
   var x = Q1.w * Q2.x + Q1.x * Q2.w + Q1.y * Q2.z - Q1.z * Q2.y;
   var y = Q1.w * Q2.y + Q1.y * Q2.w + Q1.z * Q2.x - Q1.x * Q2.z;
   var z = Q1.w * Q2.z + Q1.z * Q2.w + Q1.x * Q2.y - Q1.y * Q2.x;
   var w = Q1.w * Q2.w - Q1.x * Q2.x - Q1.y * Q2.y - Q1.z * Q2.z;
        
   return new Quaternion(x, y, z, w);
}

// Use a NORMALIZED vec3 and an angle in radians
getQuaternionFromVectorAngle = function(axis, angle)
{
   var sin_a = Math.sin(angle / 2);
   var cos_a = Math.cos(angle / 2);

   var X = axis[0] * sin_a;
   var Y = axis[1] * sin_a;
   var Z = axis[2] * sin_a;
   var W = cos_a;
        
   return new Quaternion(X, Y, Z, W);
}

getQuaternionFromHPR = function(h, p, r)
{
   var qH = getQuaternionFromVectorAngle([0, 1, 0], h);
   var qP = getQuaternionFromVectorAngle([1, 0, 0], p);
   var qR = getQuaternionFromVectorAngle([0, 0, 1], r);
        
   return quatMult(qH, quatMult(qP, qR));
}

quatNlerp = function(Q1, Q2, t)
{
   var iT = 1-t;
   var X = Q1.x * iT + Q2.x * t;
   var Y = Q1.y * iT + Q2.y * t;
   var Z = Q1.z * iT + Q2.z * t;
   var W = Q1.w * iT + Q2.w * t;
        
   var Q = new Quaternion(X, Y, Z, W);
   Q.normalize();
   return Q;
}
