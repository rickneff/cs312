function ModelDrawer(model, shaderProgram)
{
   this.model = model;
   this.shaderProgram = shaderProgram;

   this.texture = null;
        
   this.prepareBuffers = function()
      {
         // we must assume these positions are set.
         // We have decided these by convention and assigned them
         this.shaderProgram.bindArrayBuffer(shaderProgram.vertPos_buff, this.model.locations);
         this.shaderProgram.bindArrayBuffer(shaderProgram.normal_buff, this.model.normals);
         this.shaderProgram.bindArrayBuffer(shaderProgram.textureCoord_buff, this.model.UVs);
         this.shaderProgram.bindElementBuffer(shaderProgram.elements_buff, this.model.idxList);
      }
        
   this.draw = function(MV)
      {
         // set up the buffers just once
         if (this.shaderProgram.lastModelDrawn != this.model)
         {
            this.shaderProgram.lastModelDrawn = this.model;
            this.prepareBuffers();
         }

         // bind texture once too
         if (this.texture != null)
         {
            shaderProgram.GL.bindTexture(shaderProgram.GL.TEXTURE_2D, this.texture);            
            this.texture = null;
         }

         // Then just draw every frame
         // not sure if it hurts to call this every time even if it has not changed.
         this.shaderProgram.prepare();
         this.shaderProgram.GL.uniformMatrix4fv(this.shaderProgram.MVmat_pos, false,
                                                new Float32Array(transpose(MV))); // also set by convention
         this.shaderProgram.GL.drawElements(this.shaderProgram.GL.TRIANGLES,
                                            this.model.idxList.length,
                                            this.shaderProgram.GL.UNSIGNED_SHORT, 0);
      }

   this.setImage = function(image, webGL)
      {
         this.texture = webGL.LoadTexture(image);
      }
}
