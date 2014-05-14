function RenderBuffer(elementID)
{
   var canvas = document.getElementById(elementID);
   this.context = canvas.getContext("2d");
   this.width = canvas.width;
   this.height = canvas.height;
   this.imageData = this.context.createImageData(canvas.width, canvas.height);
}

RenderBuffer.prototype.flush = function()
{
   this.context.putImageData(this.imageData, 0, 0);
}

// Color must be a vec4: [r, g, b, a]
RenderBuffer.prototype.setPixel = function(x, y, color)
{
   var offset = (Math.round(y) * this.width + Math.round(x)) * 4;
   this.imageData.data[offset + 0] = color[0] * 255;
   this.imageData.data[offset + 1] = color[1] * 255;
   this.imageData.data[offset + 2] = color[2] * 255;
   this.imageData.data[offset + 3] = color[3] * 255;
}
