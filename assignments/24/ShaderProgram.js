function ShaderProgram(GL, VSID, FSID)
{
   this.GL = GL;
   this.lastModelDrawn = 0;
   var FShader = document.getElementById(FSID);
   var VShader = document.getElementById(VSID);
        
   if (!FShader || !VShader)
   {
      alert("Error, Could Not Find Shaders");
   }
   else
   {
      //Load and Compile Fragment Shader
      var Code = LoadShader(FShader);
      FShader = GL.createShader(GL.FRAGMENT_SHADER);
      GL.shaderSource(FShader, Code);
      GL.compileShader(FShader);
                
      //Load and Compile Vertex Shader
      Code = LoadShader(VShader);
      VShader = GL.createShader(GL.VERTEX_SHADER);
      GL.shaderSource(VShader, Code);
      GL.compileShader(VShader);
                
      //Create The Shader Program
      this.shaderProgram = GL.createProgram();
      GL.attachShader(this.shaderProgram, FShader);
      GL.attachShader(this.shaderProgram, VShader);
      GL.linkProgram(this.shaderProgram);
      GL.useProgram(this.shaderProgram);
   }
        
   this.findUniform = function(uniformName)
      {
         return GL.getUniformLocation(this.shaderProgram, uniformName);
      }
        
   this.createArrayBuffer = function(attributeName, arrayLen)
      {
         var location = this.GL.getAttribLocation(this.shaderProgram, attributeName);
         this.GL.enableVertexAttribArray(location); // not sure how often this needs to happen
         var buff = this.GL.createBuffer();
         this.GL.bindBuffer(this.GL.ARRAY_BUFFER, buff);
         this.GL.vertexAttribPointer(location, arrayLen, this.GL.FLOAT, false, 0, 0);
         return buff;
      }
        
   this.bindArrayBuffer = function(buff, data)
      {
         this.GL.bindBuffer(this.GL.ARRAY_BUFFER, buff);
         this.GL.bufferData(this.GL.ARRAY_BUFFER, data, this.GL.STATIC_DRAW);
      }
        
   this.createElementBuffer = function()
      {
         var buff = this.GL.createBuffer();
         this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, buff);
         return buff;
      }
        
   this.bindElementBuffer = function(buff, data)
      {
         this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, buff);
         this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, data, this.GL.STATIC_DRAW);
      }
        
   this.prepare = function()
      {
         this.GL.useProgram(this.shaderProgram);
      }
}

function LoadShader(Script)
{
   var Code = "";
   var CurrentChild = Script.firstChild;
   while (CurrentChild)
   {
      if (CurrentChild.nodeType == CurrentChild.TEXT_NODE)
         Code += CurrentChild.textContent;
      CurrentChild = CurrentChild.nextSibling;
   }
   return Code;
}
