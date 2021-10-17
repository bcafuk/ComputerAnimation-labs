# Laboratory assignment 1: Follwing a path (B-splines)

This directory contains my solution to the first laboratory exercise for the
[Computer Animation course](https://www.fer.unizg.hr/en/course/comani_a) at the Faculty of Electrical Engineering and Computing at the University of Zagreb.

## Assignment

### Summary

1. Load a sequence of points from a file.
2. Use the loaded points to define a uniform cubic B-spline.
3. Draw the spline.
4. Draw a tangent to the spline and animate it along the spline.
5. Load a 3D model from an OBJ file.
6. Draw the loaded 3D model.
7. Animate the loaded 3D model along the spline, orienting it along the tangent.

### Full text

The original full text of this assignment is [available as a PDF](http://www.zemris.fer.hr/predmeti/ra/labosi/vj1a.pdf) (in Croatian).

## Implementation

This implementation uses the [Typescript programming language](https://www.typescriptlang.org/) and [the Three.js library](https://threejs.org/) to solve the assignment.

### Building

1. Install dependencies using the command `npm install`.
2. Build the application using the command `npm run build:prod`.
3. Enter the `dist` directory and serve it using an HTTP server, for example using the command `npx http-server`.
4. Open the URL where the files are served using an up-to-date web browser.

### License

This solution is licensed under the [MIT License](../LICENSE.txt).
