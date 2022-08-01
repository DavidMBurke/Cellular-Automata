import React, { useState, useEffect, useRef } from "react";
export default function GameOfLife() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const width = 800;
  const height = 600;
  let grid = makeGrid(width * 0.1, height * 0.1);
  let nextGrid = makeGrid(width * 0.1, height * 0.1);
  let saveGrid = makeGrid(width * 0.1, height * 0.1);
  let fps = 15;
  let interval;
  let animated = false;
  let mirrorVertical = false;
  let mirrorHorizontal = false;

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
    for (let i = 0; i < width; i += 10)
      contextRef.current.fillRect(i, 0, 1, height);
    for (let i = 0; i < height; i += 10)
      contextRef.current.fillRect(0, i, width, 1);
      contextRef.current.fillRect(0, width-1, 1, height)
      contextRef.current.fillRect(height-1, 0, width, 1)
  }, []);

  const draw = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    let x = Math.floor(offsetX * 0.1);
    let y = Math.floor(offsetY * 0.1);
    selectPixel(x, y);
    if (mirrorHorizontal) drawMirrorHorizontal(x, y);
    if (mirrorVertical) drawMirrorVertical(x, y);
    if (mirrorHorizontal && mirrorVertical) drawMirrorBoth(x, y);
  };

  const selectPixel = (x, y) => {
    if (grid[x][y] === 1) {
      grid[x][y] = 0;
      drawPixel("white", contextRef.current, x, y);
    } else {
      grid[x][y] = 1;
      drawPixel("black", contextRef.current, x, y);
    }
  };

  const drawMirrorHorizontal = (x, y) => {
    if (x > 40) {
      x = 40 - (x - 40);
    } else {
      x = 40 + (40 - x);
    }
    selectPixel(x-1, y);
  };

  const drawMirrorVertical = (x, y) => {
    if (y > 30) {
      y = 30 - (y - 30);
    } else {
      y = 30 + (30 - y);
    }
    selectPixel(x, y-1);
  };

  const drawMirrorBoth = (x, y) => {
    if (x > 40) {
      x = 40 - (x - 40);
    } else {
      x = 40 + (40 - x);
    }
    if (y > 30) {
      y = 30 - (y - 30);
    } else {
      y = 30 + (30 - y);
    }
    selectPixel(x-1, y-1);
  };
  const animate = () => {
    if (animated) return;
    interval = setInterval(() => {
      iterate(grid, nextGrid, contextRef.current);
    }, 1000 / fps);
    animated = true;
  };

  const stopAnimation = () => {
    clearInterval(interval);
    animated = false;
  };

  return (
    <div className={"columns"}>
      <div className={"info"}>
        <div className={"info"}>
          <button className={"settings-button"}>How it Works</button>
        </div>
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

      <canvas id="learningCanvas" onMouseDown={draw} ref={canvasRef} />

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
            clear(grid, contextRef.current);
          }}
        >
          Clear
        </button>
        <button
          className={"settings-button"}
          onClick={() => {
            randomizeGrid(grid, contextRef.current);
          }}
        >
          Randomize
        </button>
        <h3>Speed:</h3>
        <div>
          <div className="slidecontainer">
            <input
              id="speedSlider"
              type="range"
              min={1}
              max={30}
              step={1}
              defaultValue={fps}
              className="slider"
              onChange={(evt) => {
                if (animated) {
                  stopAnimation();
                  animate();
                }
                fps = evt.target.value;
              }}
            />
          </div>
        </div>
        <h4>Mirror x: </h4>
        <input
          type="checkbox"
          checked={mirrorHorizontal}
          onChange={() => (mirrorHorizontal = !mirrorHorizontal)}
        />
        <h4>Mirror y: </h4>
        <input
          type="checkbox"
          checked={mirrorVertical}
          onChange={() => (mirrorVertical = !mirrorVertical)}
        />
      </div>
    </div>
  );
}

const clear = (grid, canvas) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j] = 0;
      drawPixel("white", canvas, i, j);
    }
  }
};

function makeGrid(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < arr[0].length; j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
}

function randomizeGrid(grid, canvas) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let random = Math.floor(Math.random() * 2);
      if (random < 1) {
        grid[i][j] = 1;
      } else {
        grid[i][j] = 0;
      }
    }
  }
  drawGrid(grid, canvas);
}

function drawGrid(grid, canvas) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j]) {
        drawPixel("black", canvas, i, j);
      } else {
        drawPixel("white", canvas, i, j);
      }
    }
  }
}

function scan(grid, x, y) {
  let count = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + 80) % 80;
      let row = (y + j + 60) % 60;
      count += grid[col][row];
    }
  }
  count -= grid[x][y];
  return count;
}

function iterate(grid, nextGrid, canvas) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let count = scan(grid, i, j);
      let state = grid[i][j];
      if (state === 0 && count === 3) {
        nextGrid[i][j] = 1;
      } else if (state === 1 && (count === 2 || count === 3)) {
        nextGrid[i][j] = 1;
      } else {
        nextGrid[i][j] = 0;
      }
    }
  }
  equalize(grid, nextGrid);
  drawGrid(grid, canvas);
}

function drawPixel(color, canvas, i, j) {
  canvas.fillStyle = color;
  canvas.fillRect(i * 10 + 1, j * 10 + 1, 9, 9);
}

function equalize(grid, gridNext) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j] = gridNext[i][j];
    }
  }
}
