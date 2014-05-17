
import pygame, sys
from pygame.locals import *
from projmatrix import *
from renderengine import *

pygame.init()

width = 500.0
height = 300.0

verts = [
         [[-1.0, +1.0, 0, 1], [1.0, 0.0, 0.0, 1.0]], # upper left red
         [[+1.0,  0.0, 0, 1], [0.0, 1.0, 0.0, 1.0]], # middle right green
         [[ 0.0, -1.0, 0, 1], [0.0, 1.0, 1.0, 1.0]], # lower middle cyan
         [[ 0.0,  0.0, 0, 1], [1.0, 1.0, 1.0, 1.0]]  # extra white point to play with
      ]

indexList = [0, 1, 1, 2, 2, 0]

# set up the window (like an HTML5 canvas)
renderSurface = pygame.display.set_mode((int(width), int(height)), 0, 32)

# Set up some basic colors
BLACK = (  0,   0,   0)
WHITE = (255, 255, 255)
RED   = (255,   0,   0)
GREEN = (  0, 255,   0)
BLUE  = (  0,   0, 255)

# Set pixels on the render surface
renderSurface.fill(BLACK)

pixelArray = pygame.PixelArray(renderSurface)

# Make a projection matrix based on the aspect ratio
aspectRatio = width / height

projMatrix = OrthoGraphicProjectionWithAspectRatio(aspectRatio)
         
# Draw the list of points (verts) with the indexList telling how
RenderEngineDrawLines(pixelArray, verts, indexList, projMatrix, width, height)

# Make sure we can still draw points
points = [
           [[0, 0, 0, 1], [1.0, 1.0, 1.0, 1.0]] # middle white
         ]

RenderEngineDrawPoints(pixelArray, points, projMatrix, width, height)

# Only YOU can prevent memory leaks!
del pixelArray

# Run the game loop
while True:
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()
            sys.exit()
    pygame.display.update()
