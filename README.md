# Volk Raycasting Tech Demo

Volk is an HTML5 raycasting tech demo using pure JavaScript and canvas.

It is similar in style to Wolfenstein 3D's engine, with no height
variance but does support textures for walls and such.

Maps are represented as arrays of arrays (2D arrays), with each element
being a number starting from 0, representing an object in the map.
Maps are 2D square grids.

0 = Empty space

1 - Positive integers = Block/wall with certain color or texture

The engine will be able to load map files (.volkmap extensions).

Current version: v0.0.0-prealpha
