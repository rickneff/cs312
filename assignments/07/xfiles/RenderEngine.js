function RenderEngine(renderBuffer)
{
   this.renderBuffer = renderBuffer;
}

// x: -1 => 0,     +1 => w - 1
// y: -1 => h - 1, +1 => 0
RenderEngine.prototype.ndc2screen = function(ndcPos)
{
   return [
      (ndcPos[0] + 1.0) * (this.renderBuffer.width - 1) * 0.5,
      (1.0 - ndcPos[1]) * (this.renderBuffer.height - 1) * 0.5
   ];
}

RenderEngine.prototype.drawPoints = function(verts)
{
   for (var i = 0; i < verts.length; i++)
   {
      var screenPos = this.ndc2screen(verts[i].getPosition());
      this.renderBuffer.setPixel(screenPos[0], screenPos[1],
                                 verts[i].getColor());
   }
}
