import React, { useState, useEffect, useRef } from "react";
export default function GameOfLife() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const width = 1200;
  const height = 800;
  let grid = makeGrid(width * 0.25, height * 0.25);
  let nextGrid = makeGrid(width * 0.25, height * 0.25);
  let saveGrid = makeGrid(width * 0.25, height * 0.25);
  const [fps, setFps] = useState(15);
  const [element, setElement] = useState(sand);
  let interval;
  let animated = false;

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
  }, []);

  const draw = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    let x = Math.floor(offsetX * 0.25);
    let y = Math.floor(offsetY * 0.25);
    if (x < 1 ||
        y < 1 ||
        x > grid.length - 2 ||
        y > grid[0].length - 2) return;
    grid[x][y] = element;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    drawPixel(grid[x][y].color, contextRef.current, x, y);
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

      <canvas id="sandCanvas" onMouseMove={draw} ref={canvasRef} />

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
        <h3>Speed: {`${fps}`} FPS</h3>
        <ul>
            <button onClick={()=>{setElement(sand)}}>Sand</button>
            <button onClick={()=>{setElement(empty)}}>Erase</button>
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
  for (let i = grid.length - 1; i > -1; i--) {
    for (let j = grid[0].length - 1; j > -1; j--) {
      if (grid[i][j] !== empty) {
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

function equalize(grid, gridNext) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j] = gridNext[i][j];
    }
  }
}

const sandMotion = (grid, gridNext, x, y) => {
  if (y + 1 > grid[0].length - 1) {
    gridNext[x][y] = grid[x][y];
  } else if (grid[x][y + 1] === empty) {
    gridNext[x][y + 1] = grid[x][y];
    gridNext[x][y] = grid[x][y + 1];
  } else if (
    grid[x][y + 1].type === "solid" &&
    grid[x - 1][y + 1].type === "solid" &&
    grid[x + 1][y + 1].type === "solid"
  ) {
    gridNext[x][y] = grid[x][y];
  } else if (
    grid[x][y + 1].type === "solid" &&
    grid[x - 1][y + 1].type !== "solid" &&
    grid[x + 1][y + 1].type === "solid"
  ) {
    gridNext[x][y] = grid[x - 1][y - 1];
    gridNext[x - 1][y - 1] = grid[x][y];
  } else if (
    grid[x][y + 1].type === "solid" &&
    grid[x - 1][y + 1].type === "solid" &&
    grid[x + 1][y - 1].type !== "solid"
  ) {
    gridNext[x][y] = grid[x + 1][y - 1];
    gridNext[x + 1][y - 1] = grid[x][y];
  } else if (
    grid[x][y + 1].type === "solid" &&
    grid[x - 1][y + 1].type !== "solid" &&
    grid[x + 1][y - 1].type !== "solid"
  ) {
    let rand = Math.floor(Math.random() * 2);
    if (rand) {
      gridNext[x][y] = grid[x + 1][y - 1];
      gridNext[x + 1][y - 1] = grid[x][y];
    } else {
      gridNext[x][y] = grid[x - 1][y - 1];
      gridNext[x - 1][y - 1] = grid[x][y];
    }
  }
};

const empty = {
  type: "empty",
  color: "darkgrey",
  motion: () => {},
};

const sand = {
  type: "solid",
  color: "yellow",
  motion: sandMotion,
};

const wall = {
  type: "solid",
  color: "black",
  motion: () => {},
};
