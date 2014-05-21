// Used in RenderEngine
function Line(P1, P2, fragmentShader)
{
   this.P1 = P1;
   this.P2 = P2;
   this.fragmentShader = fragmentShader;    
    
   this.varyingVars = new Array(); 
   this.isEOL = new Boolean(false);
    
   this.x = 0;
   this.y = 0;
   this.t = 0;
   this.maxDist = Math.max(Math.abs(this.P1[0][0] - this.P2[0][0]),
                           Math.abs(this.P1[0][1] - this.P2[0][1]));
    
   if (this.maxDist > 1)
   {
      this.incT = 1 / this.maxDist;
      this.isLine = true;
   }
    
   this.getMaxDist = function() { return this.maxDist; }
   this.getX = function() { return this.x; }
   this.getY = function() { return this.y; }
   this.getEOL = function () { return this.isEOL; } 
    
   this.nextPoint = function()
      {
         this.t += this.incT;   
        
         // x and y values are rounded so we always use integers
         this.x = Math.round(lerp(this.P1[0][0], this.P2[0][0], this.t));
         this.y = Math.round(lerp(this.P1[0][1], this.P2[0][1], this.t));

         if (this.x == this.P2[0][0] && this.y == this.P2[0][1])
         {
            this.isEOL = true;
         }
        
         // Find the varying values
         for (var j = 0; j < this.P1[1].length; j++)
         {
            this.varyingVars[j] = lerp(this.P1[1][j], this.P2[1][j], this.t);
         }
        
         // Get the color from the fragment shader with these interpolated values
         this.color = this.fragmentShader.main(this.varyingVars);

         return [[this.x, this.y], this.color];
      }
}
