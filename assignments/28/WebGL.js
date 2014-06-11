function WebGL(CID, clearColor)
{
   var canvas = document.getElementById(CID);
   this.GL = canvas.getContext("webgl");
   if (!this.GL)
   {
      this.GL = canvas.getContext("experimental-webgl");
   }
   if (!this.GL)
   {
      alert("Your Browser Doesn't Support WebGL");
      return;
   }
        
   // It seems like clear color is something that I would want to pass in
   this.GL.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]); // this is the color 
   this.GL.enable(this.GL.DEPTH_TEST); //Enable Depth Testing
   this.GL.depthFunc(this.GL.LEQUAL); //Set Perspective View
   this.GL.enable(this.GL.CULL_FACE);
   this.GL.cullFace(this.GL.BACK);
   this.GL.frontFace(this.GL.CW);
   this.aspectRatio = canvas.width / canvas.height;

   this.LoadTexture = function(Img)
   {
      //Create a new Texture and Assign it as the active one
      var TempTex = this.GL.createTexture();
      this.GL.bindTexture(this.GL.TEXTURE_2D, TempTex);  
      this.GL.pixelStorei(this.GL.UNPACK_FLIP_Y_WEBGL, true);
      
      //Load in The Image
      this.GL.texImage2D(this.GL.TEXTURE_2D, 0, this.GL.RGBA, this.GL.RGBA, this.GL.UNSIGNED_BYTE, Img);  
      
      //Setup Scaling properties
      this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MAG_FILTER, this.GL.LINEAR);  
      this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MIN_FILTER, this.GL.LINEAR_MIPMAP_NEAREST);  
      this.GL.generateMipmap(this.GL.TEXTURE_2D); 
      
      //Unbind the texture and return it.
      this.GL.bindTexture(this.GL.TEXTURE_2D, null);
      return TempTex;
   };
}
