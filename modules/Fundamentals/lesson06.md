Lesson - Rotations
==================

* Discuss Euler Rotations again as a review
  * See [computing Euler angles from a rotation matrix](http://www.soi.city.ac.uk/~sbbh653/publications/euler.pdf)
* The rows and columns of a rotation matrix are "Ortho Normal" (orthogonal + normal)
* Normalizing Vectors
* Vector Dot Product, shows angle between 2 unit vectors
  * watch [just the beginning](http://www.youtube.com/watch?v=98C7iv8OcnI), how related to Matrix Multiplication?
* Vector Cross Product
  * makes a new vector orthogonal to them both
  * order is important, see [mnemonic and cross visualization](http://en.wikipedia.org/wiki/Cross_product)
    * in general, of course, matrix multiplication is **_NOT_** commutative
    * however, in the following special cases, commutativity holds (i.e., M1 * M2 = M2 * M1)

      | M1                   | M2        |
      |----------------------|-----------|
      | Translate            | Translate |
      | Scale                | Scale     |
      | Rotate               | Rotate    |
      | Scale (with Sx = Sy) | Rotate    |

* Building a Rotational Matrix
  * Forward (or Out)
  * Up
  * Right
* Building a rotation matrix by having [a unit vector and an angle](http://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle)
* "Parenting" = the order that things happen in. Which one should happen first?
* Multiplying two rotation matrices together make a new matrix that is also orthonormal, a rotation matrix.
* Watch the video about [Euler Rotations and Gimbal Lock](http://www.youtube.com/watch?v=zc8b2Jo7mno)
* Read [article on rotations](http://www.fastgraph.com/makegames/3drotation/)
* Read [article on quaternions](http://www.cprogramming.com/tutorial/3d/quaternions.html)
* Read [article on interpolating quaternions, LERP, SLERP, and NLERP](http://keithmaggio.wordpress.com/2011/02/15/math-magician-lerp-slerp-and-nlerp/)
