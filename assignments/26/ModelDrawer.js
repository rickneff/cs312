function ModelDrawer(model, shaderProgram)
{
   this.model = model;
   this.shaderProgram = shaderProgram;
        
   this.prepareBuffers = function()
      {
         // we must assume these positions are set.
         // We have decided these by convention and assigned them
         this.shaderProgram.bindArrayBuffer(shaderProgram.vertPos_buff, this.model.locations);
         this.shaderProgram.bindArrayBuffer(shaderProgram.textureCoord_buff, this.model.UVs);
         this.shaderProgram.bindElementBuffer(shaderProgram.elements_buff, this.model.idxList);
         if (this.texture != -1)
         {
            shaderProgram.GL.bindTexture(shaderProgram.GL.TEXTURE_2D, this.texture);            
         }
      }
        
   this.draw = function(MVP)
      {
         // set up the buffers just once
         if (this.shaderProgram.lastModelDrawn != this.model)
         {
            this.shaderProgram.lastModelDrawn = this.model;
            this.prepareBuffers();
         }
         // Then just draw every frame
         // not sure if it hurts to call this every time even if it has not changed.
         this.shaderProgram.prepare();
         this.shaderProgram.GL.uniformMatrix4fv(this.shaderProgram.mvp_pos, false,
                                                new Float32Array(transpose(MVP))); // also set by convention
         this.shaderProgram.GL.drawElements(this.shaderProgram.GL.TRIANGLES,
                                            this.model.idxList.length,
                                            this.shaderProgram.GL.UNSIGNED_SHORT, 0);
      }

   this.texture = -1;
   this.setImage = function(image, webGL)
      {
         this.texture = webGL.LoadTexture(image);
      }
}
