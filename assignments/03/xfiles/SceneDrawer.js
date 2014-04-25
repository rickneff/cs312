function color(r, g, b, a)
{
   var C = new Object();
   C.r = r; C.g = g; C.b = b; C.a = a;
   return C;
}

function colorAdd(A, B)
{
   return color(A.r + B.r, A.g + B.g, A.b + B.b, A.a + B.a);
}

function colorSub(A, B)
{
   return color(A.r - B.r, A.g - B.g, A.b - B.b, A.a - B.a);
}

function scalarMult(A, s)
{
   return color(A.r * s, A.g * s, A.b * s, A.a * s);
}

function colorLerp(A, B, t)
{
   return colorAdd(A, scalarMult(colorSub(B, A), t));
}

function setPixel(imageData, x, y, color)
{
   var offset = (y * imageData.width + x) * 4;
   imageData.data[offset + 0] = (color.r * 255);
   imageData.data[offset + 1] = (color.g * 255);
   imageData.data[offset + 2] = (color.b * 255);
   imageData.data[offset + 3] = (color.a * 255);
}

function drawGradient(imageData, upperLeft, upperRight, lowerLeft, lowerRight)
{
   var w = imageData.width;
   var iw = 1 / (w - 1);
   var h = imageData.height;
   var ih = 1 / (h - 1);
   for (var x = 0; x < w; x++)
   {
      var tX = x * iw;
      var top = colorLerp(upperLeft, upperRight, tX);
      var bottom = colorLerp(lowerLeft, lowerRight, tX);
      for (var y = 0; y < h; y++)
      {
         var tY =  y * ih;
         setPixel(imageData, x, y, colorLerp(top, bottom, tY));
      }
   }
}
