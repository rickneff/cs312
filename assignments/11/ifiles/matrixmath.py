def matrixPostMult(m, v):
    """
    Make a vec4 by post-multiplying the matrix by the vector
    """
    return [
      m[ 0] * v[0] + m[ 1] * v[1] + m[ 2] * v[2] + m[ 3] * v[3], 
      m[ 4] * v[0] + m[ 5] * v[1] + m[ 6] * v[2] + m[ 7] * v[3],
      m[ 8] * v[0] + m[ 9] * v[1] + m[10] * v[2] + m[11] * v[3],
      m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3]
      ]

def lerp(A, B, t):
    """
    Linear interpolatation of fraction t between A and B
    """
    return (B - A) * t + A


        
