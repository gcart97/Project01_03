"use strict";

var canvas;
var gl;
var program;
var bufferId;
var uColor;
var uTheta;

var theta = 0.0;  // Rotation angle
var delay = 100;  // Delay between frames
var direction = true;  // Rotation direction

// Global variables for storing current state
var verticesData = {
    triangles: [
        vec2(-0.15, -0.0),
        vec2(0.0, 0.15),
        vec2(0.15, 0.0)
    ],
    squares: []
};

var colors = {
    triangles: [1.0, 1.0, 1.0, 1.0],  // White
    squares: [0.0, 1.0, 0.0, 1.0]    // Green 
};

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) { 
        alert("WebGL 2.0 isn't available"); 
        return; 
    }

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Create and bind buffer
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

    // Associate shader variable with the buffer
    var aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // Get the location of the uniform variables
    uColor = gl.getUniformLocation(program, "uColor");
    uTheta = gl.getUniformLocation(program, "uTheta");

    // Set up event handler for menu
    document.getElementById("Growth").onchange = function(event) {
        switch(event.target.value) {
            case "0":
                sprout();
                break;
            case "1":
                grow();
                break;
            case "2":
                bloom();
                break;
        }
    };

    // Start animation
    requestAnimationFrame(render);
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw triangles
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesData.triangles), gl.STATIC_DRAW);
  gl.uniform4fv(uColor, colors.triangles);
  gl.uniform1f(uTheta, 0.0); // No rotation for triangles
  gl.uniform1i(gl.getUniformLocation(program, "isSquare"), 0); // Set isSquare to false
  gl.drawArrays(gl.TRIANGLES, 0, verticesData.triangles.length);

  // Draw rotating square
  if (verticesData.squares.length > 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
      gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesData.squares), gl.STATIC_DRAW);
      gl.uniform4fv(uColor, colors.squares);
      gl.uniform1f(uTheta, theta); // Rotation for the square
      gl.uniform1i(gl.getUniformLocation(program, "isSquare"), 1); 
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, verticesData.squares.length);
  }

  // Update rotation angle
  theta += (direction ? 0.01 : -0.01); // Adjust speed as needed

  // Request next frame
  setTimeout(function() {
      requestAnimationFrame(render);
  }, delay);
}


function sprout() {
    verticesData.triangles = [
        vec2(-0.15, -0.0),
        vec2(0.0, 0.15),
        vec2(0.15, 0.0)
    ];
    colors.triangles = [1.0, 1.0, 1.0, 1.0]; // White
    render();
}

function grow() {
    verticesData.triangles = [
        // Triangle 1
        vec2(-0.5, 0.0),
        vec2(0, 0.5),
        vec2(0.5, 0.0),

        // Triangle 2
        vec2(1, 0.0),
        vec2(0.75, -0.25),
        vec2(0.5, 0.0),

        // Triangle 3
        vec2(-1, 0.0),
        vec2(-0.75, 0.25),
        vec2(-0.5, 0.0)
    ];
    colors.triangles = [1.0, 0.0, 1.0, 1.0]; // Magenta
    render();
}

function bloom() {
  verticesData.triangles = [
      // Triangle 1
      vec2(-0.5, 0.0),
      vec2(0, 0.5),
      vec2(0.5, 0.0),

      // Triangle 2
      vec2(1, 0.0),
      vec2(0.75, -0.25),
      vec2(0.5, 0.0),

      // Triangle 3
      vec2(-1, 0.0),
      vec2(-0.75, 0.25),
      vec2(-0.5, 0.0)
  ];
  colors.triangles = [1.0, 0.0, 1.0, 1.0]; // Magenta

  // Rotating square vertices centered at (0, 0)
  verticesData.squares = [
    vec2(-0.25, 0.25), 
    vec2(0.25, 0.25), 
    vec2(-0.25, 0.75), 
    vec2(0.25, 0.75)   
];

  colors.squares = [0.0, 1.0, 1.0, 1.0]; // Cyan

  // Animation
  requestAnimationFrame(render);
}

