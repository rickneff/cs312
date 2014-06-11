// requires MatrixMath.js and Quaternion.js
function XForm()
{
   this.pos = [0, 0, 0];
   this.ctr = [0, 0, 0];
   this.scale = [1, 1, 1];
   this.rot = new Quaternion();
        
   this.findMatrix = function()
      {
         var posMat = TranslateMatrixWithVector(this.pos);
         var ctrMat = TranslateMatrixWithVector(this.ctr);
         var negCtrMat = TranslateMatrixWithVector(vectorMult(this.ctr, -1));
         var scaleMat = ScaleMatrixWithVector(this.scale);
         var rotMat = this.rot.getMatrix();
                
         return chainMultMat(posMat, ctrMat, rotMat, scaleMat, negCtrMat);
      }

   this.findInverseMatrix = function()
      {
         // Find the inverses of each part
         var negPosMat = TranslateMatrixWithVector(vectorMult(this.pos, -1));
         var ctrMat = TranslateMatrixWithVector(this.ctr);
         var negCtrMat = TranslateMatrixWithVector(vectorMult(this.ctr, -1));
         var invScaleMat = ScaleMatrix(1 / this.scale[0],
                                       1 / this.scale[1],
                                       1 / this.scale[2]);
         var invRotMat = transpose(this.rot.getMatrix());
      
         // Multiply them in reverse order
         return chainMultMat(ctrMat, invScaleMat, invRotMat, ctrMat, negPosMat);
      }
}

lerpXform = function(x1, x2, t)
{
   var iT = 1 - t;
   var ret = new XForm();
   ret.pos[0] = x1.pos[0] * iT + x2.pos[0] * t;
   ret.pos[1] = x1.pos[1] * iT + x2.pos[1] * t;
   ret.pos[2] = x1.pos[2] * iT + x2.pos[2] * t;
   
   ret.ctr[0] = x1.ctr[0] * iT + x2.ctr[0] * t;
   ret.ctr[1] = x1.ctr[1] * iT + x2.ctr[1] * t;
   ret.ctr[2] = x1.ctr[2] * iT + x2.ctr[2] * t;
   
   ret.scale[0] = x1.scale[0] * iT + x2.scale[0] * t;
   ret.scale[1] = x1.scale[1] * iT + x2.scale[1] * t;
   ret.scale[2] = x1.scale[2] * iT + x2.scale[2] * t;
   
   ret.rot = quatNlerp(x1.rot, x2.rot, t);
   return ret;
}

function Group()
{
   // be able to set children of this xform that are drawn
   this.children = (arguments.length == 0) ? [] : arguments;
   this.xForm = new XForm();
        
   this.draw = function(MV)
      {
         var myMV = matrixXmatrix(MV, this.xForm.findMatrix());
         for (var i = 0; i < this.children.length; i++)
         {
            this.children[i].draw(myMV);
         }
      }
}
