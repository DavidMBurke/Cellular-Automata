import React, { useState, useEffect, useRef } from "react";
import {empty, sand, water, wall, stone, gas} from "./materials"
export default function FallingSand() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const width = 1200;
  const height = 800;
  let grid = makeGrid(width * 0.25, height * 0.25);
  let nextGrid = makeGrid(width * 0.25, height * 0.25);
  let saveGrid = makeGrid(width * 0.25, height * 0.25);
  let element = water;
  let penSize = 2;
  let interval;
  let animated = false;
  let isDrawing = false;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width;
    canvas.style.height = height;

    const context = canvas.getContext("2d");
    context.scale(1, 1);
    context.lineCap = "butt";
    context.strokeStyle = "black";
    context.lineWidth = 1;
    contextRef.current = context;
    clear(grid, nextGrid, contextRef.current);
    animate();
  }, []);

  const draw = ({ nativeEvent }) => {
    if (isDrawing) {
      const { offsetX, offsetY } = nativeEvent;
      let x = Math.floor(offsetX * 0.25);
      let y = Math.floor(offsetY * 0.25);
      if (x < 1 || y < 1 || x > grid.length - 2 || y > grid[0].length - 2)
        return;
      for (let i = -penSize; i < penSize - 1; i++) {
        for (let j = -penSize; j < penSize - 1; j++) {
          grid[x + i][y + j] = element;
          drawPixel(grid[x][y].color, contextRef.current, x + i, y + j);
        }
      }
      isDrawing = true;
    }
  };
  const startDraw = () => {
    isDrawing = true;
  };

  const stopDraw = () => {
    isDrawing = false;
  };

  const animate = () => {
    if (animated) return;
    interval = setInterval(() => {
      iterate(grid, nextGrid, contextRef.current);
    }, 40);
    animated = true;
  };

  const stopAnimation = () => {
    clearInterval(interval);
    animated = false;
  };

  return (
    <div className={"columns"}>
      <div className={"info"}>
        <button
          className={"settings-button"}
          onClick={() => {
            equalize(saveGrid, grid);
          }}
        >
          Save
        </button>
        <button
          className={"settings-button"}
          onClick={() => {
            equalize(grid, saveGrid);
            drawGrid(saveGrid, contextRef.current);
          }}
        >
          Load
        </button>
      </div>

      <canvas
        id="sandCanvas"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        ref={canvasRef}
      />

      <div className={"settings"}>
        <button
          className={"settings-button"}
          onClick={() => {
            animated ? stopAnimation() : animate();
          }}
        >
          Start / Stop
        </button>
        <button
          className={"settings-button"}
          onClick={() => {
            iterate(grid, nextGrid, contextRef.current);
          }}
        >
          Step
        </button>
        <button
          className={"settings-button"}
          onClick={() => {
            clear(grid, nextGrid, contextRef.current);
          }}
        >
          Clear
        </button>
        <h3>Pensize:</h3>
        <div>
          <button onClick={() => (penSize = 1)}>1</button>
          <button onClick={() => (penSize = 2)}>3</button>
          <button onClick={() => (penSize = 3)}>5</button>
          <button onClick={() => (penSize = 4)}>7</button>
          <button onClick={() => (penSize = 5)}>9</button>
        </div>
        <ul>
          <button
            onClick={() => {
              element = empty;
            }}
          >
            Erase
          </button>
          <button
            onClick={() => {
              element = sand;
            }}
          >
            Sand
          </button>
          <button
            onClick={() => {
              element = water;
            }}
          >
            Water
          </button>
          <button
            onClick={() => {
              element = stone;
            }}
          >
            Stone
          </button>
          <button
            onClick={() => {
              element = gas;
            }}
          >
            Gas
          </button>
        </ul>
      </div>
    </div>
  );
}

const clear = (grid, nextGrid, canvas) => {
  for (let i = grid.length - 1; i > -1; i--) {
    for (let j = grid[0].length - 1; j > -1; j--) {
      if (
        i === 0 ||
        j === 0 ||
        i === grid.length - 1 ||
        j === grid[0].length - 1
      ) {
        grid[i][j] = wall;
        nextGrid[i][j] = wall;
        drawPixel("black", canvas, i, j);
      } else {
        grid[i][j] = empty;
        nextGrid[i][j] = empty;
        drawPixel("darkgrey", canvas, i, j);
      }
    }
  }
};

function makeGrid(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < arr[0].length; j++) {
      arr[i][j] = empty;
    }
  }
  return arr;
}

function drawGrid(grid, canvas) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j]) {
        drawPixel(grid[i][j].color, canvas, i, j);
      } else {
        drawPixel("darkgrey", canvas, i, j);
      }
    }
  }
}

function iterate(grid, nextGrid, canvas) {
  let rand = Math.floor(Math.random() * 2);
  if (rand) {
    for (let i = grid.length - 1; i > -1; i--) {
      for (let j = 0; j < grid[0].length; j++) {
          grid[i][j].motion(grid, nextGrid, i, j);
      }
    }
  } else {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
          grid[i][j].motion(grid, nextGrid, i, j);
      }
    }
  }
  equalize(grid, nextGrid);
  drawGrid(grid, canvas);
}

function drawPixel(color, canvas, i, j) {
  canvas.fillStyle = color;
  canvas.fillRect(i * 4, j * 4, 4, 4);
}

function equalize(grid, nextGrid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j] = nextGrid[i][j];
    }
  }
}

