
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

RenderBuffer.prototype.setPixel = function(x, y, r, g, b, a)
{
   var offset = (y * this.width + x) * 4;
   this.imageData.data[offset + 0] = r;
   this.imageData.data[offset + 1] = g;
   this.imageData.data[offset + 2] = b;
   this.imageData.data[offset + 3] = a;
}
