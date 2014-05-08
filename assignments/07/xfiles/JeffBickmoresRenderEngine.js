
function RenderEngine(renderBuffer)
{
   var buffer = renderBuffer;
   function ndc2screen(pos)
   {
      var w = renderBuffer.width - 1;
      var h = renderBuffer.height - 1;
      posS = new Object()
      {
        var x;
        var y;
      };

      posS.x = Math.round( ((w * pos[0]) + w) /2);
      posS.y = Math.round( (( h * -pos[1]) + h) / 2);
      return posS;
   } 
   this.drawPoints = function (points)
   {
      points.forEach(function(point)
      {
          var pos = point.getPosition();
          pos = ndc2screen(pos);
          var color = point.getColor();
          buffer.setPixel(pos.x, pos.y, color);
      });
   }
}
