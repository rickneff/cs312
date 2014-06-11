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
}
