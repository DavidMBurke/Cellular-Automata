import React, { useEffect, useRef } from "react";
export default function GameOfLife() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const width = 1200;
  const height = 800;
  let grid = makeGrid(width * 0.1, height * 0.1);
  let nextGrid = makeGrid(width * 0.1, height * 0.1);
  let fps = 0

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
    for (let i = 10; i < width; i += 10)
      contextRef.current.fillRect(i, 0, 1, height);
    for (let i = 10; i < height; i += 10)
      contextRef.current.fillRect(0, i, width, 1);
    for (let i = 100; i < width; i += 100)
      contextRef.current.fillRect(i, 0, 2, height);
    for (let i = 100; i < height; i += 100)
      contextRef.current.fillRect(0, i, width, 2);
  }, []);

  const draw = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    let x = Math.floor(offsetX * 0.1);
    let y = Math.floor(offsetY * 0.1);
    if (grid[x][y] === 1) {
      grid[x][y] = 0;
      drawPixel("white", contextRef.current, x, y);
    } else {
      grid[x][y] = 1;
      drawPixel("black", contextRef.current, x, y);
    }
  };

  const animate = () => {
      let interval = 1000/fps;
      setInterval(iterate(grid, nextGrid, contextRef.current),interval)
  }

  const scanOnMouseOver = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    let x = Math.floor(offsetX * 0.1);
    let y = Math.floor(offsetY * 0.1);
    console.log(scan(grid, x, y))
  }

  function scanAll() {
    iterate();
    let valueArray = makeGrid(10, 10);
    let neighborArray = makeGrid(10, 10);
    drawGrid(grid, contextRef.current);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        neighborArray[i][j] = scan(grid, i, j);
        valueArray[i][j] = grid[i][j];
      }
    }
    console.table(valueArray);
    console.table(neighborArray);
  }

  return (
    <div className={"columns"}>
      <div className={"info"}>
        <button className={"settings-button"}>Save</button>
        <button className={"settings-button"}>Load</button>
      </div>
      <canvas id="learningCanvas" onMouseDown={draw} 
      //onMouseMove={scanOnMouseOver} 
      ref={canvasRef} />
      <div className={"settings"}>
        <button className={"settings-button"}>Start / Stop</button>
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
        <h3>Speed: {`${fps}`} FPS</h3>
        <div>
          <div className="slidecontainer">
            <input
              id="speedSlider"
              type="range"
              min={0}
              max={25}
              defaultValue={0}
              className="slider"
              onChange={(event)=>{fps=event.target.value; animate()}}
            />
          </div>
        </div>
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
      let col = (x + i + 120) % 120;
      let row = (y + j + 80) % 80;
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
  canvas.fillRect(i * 10 + 2, j * 10 + 2, 8, 8);
}

function equalize(grid, gridNext) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            grid[i][j] = gridNext[i][j];
        }
    }
}