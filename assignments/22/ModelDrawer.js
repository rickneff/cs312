function ModelDrawer(model, shaderProgram)
{
   this.model = model;
   this.shaderProgram = shaderProgram;
        
   this.prepareBuffers = function(shaderProgram)
      {
         // we must assume these positions are set.
         // We have decided these by convention and assigned them
         shaderProgram.bindArrayBuffer(shaderProgram.vertPos_buff, this.model.locations);
         shaderProgram.bindArrayBuffer(shaderProgram.vertColor_buff, this.model.colors);
         shaderProgram.bindElementBuffer(shaderProgram.elements_buff, this.model.idxList);
      }
        
   this.draw = function(MVP)
      {
         // set up the buffers just once
         if (this.shaderProgram.lastModelDrawn != this.model)
         {
            this.shaderProgram.lastModelDrawn = this.model;
            this.prepareBuffers(shaderProgram);
         }
         // Then just draw every frame
         // not sure if it hurts to call this every time even if it has not changed.
         this.shaderProgram.prepare();
         this.shaderProgram.GL.uniformMatrix4fv(this.shaderProgram.mvp_pos, false,
                                                new Float32Array(transpose(MVP))); // also set by convention
         this.shaderProgram.GL.drawElements(GL.GL.TRIANGLES, this.model.idxList.length,
                                            GL.GL.UNSIGNED_SHORT, 0);
      }
}
