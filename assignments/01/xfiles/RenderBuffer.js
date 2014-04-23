// The scanline is one line in the imageData
// we can calculate the offset for ONE time.
function ScanLine(imageData, row)
{
	this.imageData = imageData;
	// Note that we still have to do this every row,
   // but the alternative is to pass in some kind of
   // offset value we are adding to, which would reveal lots
   // of internal details.
   // I choose NOT to break encapsulation for that level of optimization.
	this.rowOffset = imageData.width * row * 4;
}

ScanLine.prototype.setPixel = function(x, r, g, b, a)
{
	var offset = this.rowOffset + (x * 4);
	this.imageData.data[offset + 0] = r;
	this.imageData.data[offset + 1] = g;
	this.imageData.data[offset + 2] = b;
	this.imageData.data[offset + 3] = a;
}

function RenderBuffer(elementID)
{
   var canvas = document.getElementById(elementID);
   this.context = canvas.getContext("2d");
   this.width = canvas.width;
   this.height = canvas.height;
   this.imageData = this.context.createImageData(canvas.width, canvas.height);
}

RenderBuffer.prototype.getScanLine = function(row)
{
	return new ScanLine(this.imageData, row);
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
