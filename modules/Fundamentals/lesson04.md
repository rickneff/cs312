Introduction to Linear Algebra
==============================

* 5x + 7y (linear combination of x and y, can be made equal to gcd(5, 7) = 1)
* Scalars (i.e., numbers)
* Vectors (i.e., lists of numbers)
* Add, Subtract, Multiply by a Scalar
* Vectors of vectors (aka Matrices, can be represented by variables like x and y)
  * row major (a column of rows)
  * column major (a row of columns)
* Dot Product of Vectors
* Add, Subtract, Multiply Matrices
  * Consider what a function is: an object that produces outputs from inputs.
  * matrices can represent all of these: functions, inputs and outputs.
  * a matrix product can represent functions being applied to lists of inputs producing lists of outputs.

```
    +-  -+       +-  -+        +-  -+
    |  1 |       |  3 |        |  2 |
3 * |  4 | + 2 * | -1 | + -1 * |  5 |    is equivalent to 3A + 2B + (-1)C where A, B and C are vectors.
    | -1 |       |  9 |        |  6 |
    +-  -+       +-  -+        +-  -+

    +-  -+   +-  -+   +-  -+
    |  3 |   |  6 |   | -2 |
  = | 12 | + | -2 | + | -5 |
    | -3 |   | 18 |   | -6 |
    +-  -+   +-  -+   +-  -+

    +-  -+
    |  7 |
  = |  5 |
    |  9 |
    +-  -+

             +-          -+
             |  1   4  -1 |
[3, 2, -1] * |  3  -1   9 |
             |  2   5   6 |
             +-          -+

           = [7, 5, 9]
```

