var ignoreDepthBuffer = false;

function ScanLine(imageData, y, width, depthBuffer)
{
   this.offset = y * imageData.width;
   this.imageData = imageData;
   this.width = width;
   this.depthBuffer = depthBuffer;
}
 
ScanLine.prototype.setPixel = function(x, depth, color)
{
   var offset = this.offset + x;
   if (ignoreDepthBuffer || depth < this.depthBuffer[offset])
   {
      this.depthBuffer[offset] = depth;
      offset *= 4;
      this.imageData.data[offset + 0] = color[0] * 255;
      this.imageData.data[offset + 1] = color[1] * 255;
      this.imageData.data[offset + 2] = color[2] * 255;
      this.imageData.data[offset + 3] = color[3] * 255;
   }
}

RenderBuffer.prototype.getScanLine = function(y)
{
   return new ScanLine(this.imageData, y, this.width, this.depthBuffer);
}

function RenderBuffer(elementID)
{
   var canvas = document.getElementById(elementID);
   this.context = canvas.getContext("2d");
   this.width = canvas.width;
   this.height = canvas.height;
   this.imageData = this.context.createImageData(canvas.width, canvas.height);
   var bufferSize = this.width * this.height;
   this.depthBuffer = new Array(bufferSize);
   for (var i = 0; i < bufferSize; i++)
   {
      this.depthBuffer[i] = Number.MAX_VALUE;
   }
}

RenderBuffer.prototype.flush = function()
{
   this.context.putImageData(this.imageData, 0, 0);
}

// Color must be a vec4: [r, g, b, a]
RenderBuffer.prototype.setPixel = function(x, y, depth, color)
{
   var offset = y * this.width + x;
   if (ignoreDepthBuffer || depth < this.depthBuffer[offset])
   {
      this.depthBuffer[offset] = depth;
      offset *= 4;
      this.imageData.data[offset + 0] = color[0] * 255;
      this.imageData.data[offset + 1] = color[1] * 255;
      this.imageData.data[offset + 2] = color[2] * 255;
      this.imageData.data[offset + 3] = color[3] * 255;
   }
}
