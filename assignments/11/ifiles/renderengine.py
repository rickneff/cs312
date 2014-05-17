from matrixmath import *

positionIdx = 0
colorIdx = 1

def RenderBufferSetPixel(pixelArray, x, y, color):
    pixelArray[int(x)][int(y)] = (int(color[0] * 255),
                                  int(color[1] * 255),
                                  int(color[2] * 255))

def RenderEngineNDC2Screen(ndcPos, width, height):
    return [
        round((ndcPos[0] + 1.0) * (width - 1) * 0.5),
        round((1.0 - ndcPos[1]) * (height - 1) * 0.5)]

def RenderEngineDrawPoints(pixelArray, verts, projMatrix, width, height):
    for vert in verts:
        screenPos = RenderEngineNDC2Screen(
            matrixPostMult(projMatrix, vert[positionIdx]), width, height)
        color = vert[colorIdx]
        RenderBufferSetPixel(pixelArray, screenPos[0], screenPos[1], color)

def RenderEngineDrawLine(pixelArray, P1, P2):
    # Decide how far we want to loop by taking
    # the max distance along x and y locations
    # Remember, screen coordinates are held in [0] and
    # varying values are held in [1]
    maxDist = max(abs(P1[0][0] - P2[0][0]),
                  abs(P1[0][1] - P2[0][1]))
   
    # Note that maxDist should be an integer value,
    # a distance between the rounded P1 and P2 screen positions.
    # Watch for them being on top of each other by checking the value.
    # If they are on top of each other, maxDist will be <= 1
    # and nothing will be drawn in between them.
    if maxDist > 1:
       # We can reuse this varying list of interpolated values
       incT = 1 / maxDist
       t = 0
       varyingVars = [0, 0, 0, 0]

       for i in range(int(maxDist) - 1):
           # Smoothly interpolate all values based on the t value 
           t += incT
         
           # x and y values are rounded so we always use integers
           x = round(lerp(P1[0][0], P2[0][0], t))
           y = round(lerp(P1[0][1], P2[0][1], t))
         
           # Find the varying values
           for j in range(len(P1[1]) - 1):
               varyingVars[j] = lerp(P1[1][j], P2[1][j], t)
         
           # Get the color with these interpolated values
           color = varyingVars
         
           # Finally set the pixel
           RenderBufferSetPixel(pixelArray, x, y, color)
   
    # Draw the 2 end-points
    RenderBufferSetPixel(pixelArray, P1[0][0], P1[0][1], P1[1])
    RenderBufferSetPixel(pixelArray, P2[0][0], P2[0][1], P2[1])

def RenderEngineDrawLines(pixelArray, verts, indexList, projMatrix, width, height):
    # Walk through the vertex shader for every vertex and keep the values
    translatedVerts = []
    varyingVars = []
    for vert in verts:
        # Append the NDC coordinates and the smooth variables for each 
        translatedVerts.append(
            RenderEngineNDC2Screen(
            matrixPostMult(projMatrix, vert[positionIdx]),
                width, height))
        varyingVars.append(vert[colorIdx])

    # Loop through the indexList in pairs to draw the lines
    for i in range(0, len(indexList) - 1, 2):
        P1 = [translatedVerts[indexList[i + 0]],
                  varyingVars[indexList[i + 0]]]
        P2 = [translatedVerts[indexList[i + 1]],
                  varyingVars[indexList[i + 1]]]

        RenderEngineDrawLine(pixelArray, P1, P2)
