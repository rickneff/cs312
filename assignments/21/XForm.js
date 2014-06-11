function XForm()
{
   this.pos = [0, 0, 0];
   this.ctr = [0, 0, 0];
   this.scale = [1, 1, 1];
   this.rot = [0, 0, 0];
        
   this.findMatrix = function()
      {
         var posMat = TranslateMatrixWithVector(this.pos);
         var ctrMat = TranslateMatrixWithVector(this.ctr);
         var negCtrMat = TranslateMatrixWithVector(vectorMult(this.ctr, -1));
         var scaleMat = ScaleMatrixWithVector(this.scale);
         var rotMat = RotateEulerWithVector(this.rot);
                
         return chainMultMat(posMat, ctrMat, rotMat, scaleMat, negCtrMat);
      }
}

function Group()
{
   // be able to set children of this xform that are drawn
   this.children = (arguments.length == 0) ? [] : arguments;
   this.xForm = new XForm();
        
   this.draw = function(MVP)
      {
         var myMVP = matrixXmatrix(MVP, this.xForm.findMatrix());
         for (var i = 0; i < this.children.length; i++)
         {
            this.children[i].draw(myMVP);
         }
      }
}
