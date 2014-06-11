function ModelDrawer(model, shaderProgram)
{
   this.model = model;
   this.shaderProgram = shaderProgram;
        
   this.ambientTexture = null;
   this.diffuseTexture = null;
   this.specularTexture = null;

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

         // bind textures once too
         if (this.diffuseTexture != null)
         {
            shaderProgram.GL.activeTexture(webGL.GL.TEXTURE0);
            shaderProgram.GL.bindTexture(shaderProgram.GL.TEXTURE_2D, this.diffuseTexture);
            this.diffuseTexture = null;
         }

         if (this.ambientTexture != null)
         {
            shaderProgram.GL.activeTexture(webGL.GL.TEXTURE1);
            shaderProgram.GL.bindTexture(shaderProgram.GL.TEXTURE_2D, this.ambientTexture);
            this.ambientTexture = null;
         }

         if (this.specularTexture != null)
         {
            shaderProgram.GL.activeTexture(webGL.GL.TEXTURE2);
            shaderProgram.GL.bindTexture(shaderProgram.GL.TEXTURE_2D, this.specularTexture);
            this.specularTexture = null;
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

   this.setAmbientImage = function(image, webGL)
      {
         this.ambientTexture = webGL.LoadTexture(image);
      }

   this.setDiffuseImage = function(image, webGL)
      {
         this.diffuseTexture = webGL.LoadTexture(image);
      }

   this.setSpecularImage = function(image, webGL)
      {
         this.specularTexture = webGL.LoadTexture(image);
      }
}
