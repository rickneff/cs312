/**************************************************************************
 * One-dimensional Linear Transform
 *
 * This linear transform maps a point x
 * from one space (C to D) to another space (E to F).
 * C is the start of the first space and D is the end.
 * E is the start of the second space and F is the end.
 *
 * In this example, the first point is at -3,
 * which is halfway across the first space.
 * That means it should be mapped to halfway across the second space (15).
 **************************************************************************/
#include <iostream>
using namespace std;

float LinearTransform(float x, float C, float D, float E, float F)
{
   float A =          (F - E) / (D - C);
   float B = E - (C * (F - E) / (D - C));
    
   return (A * x) + B;
}

int main()
{
   float space1start = -4;
   float space1end   = -2;
    
   float space2start = 10;
   float space2end   = 20;
    
   float pointInSpace1 = -3;
    
   float pointInSpace2 = LinearTransform(pointInSpace1,
                                         space1start, space1end,
                                         space2start, space2end);
    
   cout << "Transform of point " << pointInSpace1
        << " in space 1 is to point " << pointInSpace2
        << " in space 2." << endl;
    
   return 0;
}
