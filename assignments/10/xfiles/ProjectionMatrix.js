OrthoGraphicProjection = function(left, right, top, bottom, near, far)
{
   return [
      2/(right-left), 0,              0,            -((right+left)/(right-left)),
      0,              2/(top-bottom), 0,            -((top+bottom)/(top-bottom)),
      0,              0,              2/(far-near), -((far+near)/(far-near)),
      0,              0,              0,            1
   ];
}

OrthoGraphicProjectionWithAspectRatio = function(aspectRatio)
{
   var left = -1;
   var right = +1;
   var top = +1;
   var bottom = -1;
   var near = -1;
   var far = +1;
   if (aspectRatio > 1.0)
   {
      left *= aspectRatio;
      right *= aspectRatio;
   }
   else
   {
      top /= aspectRatio;
      bottom /= aspectRatio;
   }
   
   return OrthoGraphicProjection(left, right, top, bottom, near, far);
}
