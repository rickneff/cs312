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
    |  1 |       |  3 |        |  2 |
3 * |  4 | + 2 * | -1 | + -1 * |  5 |    is equivalent to 3A + 2B + (-1)C where A, B and C are vectors.
    | -1 |       |  9 |        |  6 |

    |  3 |   |  6 |   | -2 |
  = | 12 | + | -2 | + | -5 |
    | -3 |   | 18 |   | -6 |

    |  7 |
  = |  5 |
    |  9 |

             |  1   4  -1 |
[3, 2, -1] * |  3  -1   9 |
             |  2   5   6 |

           = [7, 5, 9]
```

* Thanks to Trevor for recommending Kahn Academy's [introduction to linear algebra](https://www.khanacademy.org/math/linear-algebra), which he endorses as providing a good foundation for understanding the intricacies of the topic.
* While looking at some of the rotations readings, I found another great [introduction to linear algebra](http://blog.wolfire.com/2009/07/linear-algebra-for-game-developers-part-1/) that's geared for game developers.
* Also, check out this [intuitive guide to linear algebra](http://betterexplained.com/articles/linear-algebra-guide/)!
* And for more javascript help, showing how simple a line-drawing package can be, check out [flinkcharts](https://github.com/nicklecoder/flinkCharts) by Adam Nickle.
