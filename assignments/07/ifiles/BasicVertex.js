// A simple vertex with a position and a color set in the constructor
// Note that there may be other kinds of vertices as well.  They should all have
// a getPosition and a getColor
var BasicVertex = function (pos, col)
{
   // Create some member functions.  Note we don't have to store the values because it is a closure.
   var posGetter = function() { return pos; }
   var colGetter = function() { return col; }
   
   // Make some public functions
   return {
      getPosition: posGetter,
      getColor: colGetter
   };
}
