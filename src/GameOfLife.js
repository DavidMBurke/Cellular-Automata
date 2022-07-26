import React, { useEffect, useState, useRef } from "react";
export default function GameOfLife() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const width = 1200;
  const height = 800;
  let grid = makeGrid(width * 0.1, height * 0.1);
  let nextGrid = grid;
  randomizeGrid(grid);

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
    let x = Math.floor(offsetX * .1);
    let y = Math.floor(offsetY * .1);
    if (grid[x][y] === 1) {
        grid[x][y] = 0;
        drawPixel("white", contextRef.current, x, y);
    } else {
        grid[x][y] = 1;
        drawPixel("black", contextRef.current, x, y);    }
  };

  function iterate() {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        let count = scan(grid, i, j);
        let state = grid[i][j];
        if (state === 0 && count === 3) {
          nextGrid[i][j] = 1;
        } else if (state === 1 && (count < 2 || count > 3)) {
          nextGrid[i][j] = 0;
        } else {
          nextGrid[i][j] = state;
        }
      }
    }
    grid = nextGrid;
    for (let i = 0; i < width * 0.1; i++) {
      for (let j = 0; j < height * 0.1; j++) {
        if (grid[i][j]) {
          drawPixel("black", contextRef.current, i, j);
        } else {
          drawPixel("white", contextRef.current, i, j);
        }
      }
    }
    console.log(grid)
  }

  function scanAll() {
    iterate();
    let valueArray = makeGrid(10,10)
    let neighborArray = makeGrid(10,10)
    for (let i = 0; i < width * 0.1; i++) {
        for (let j = 0; j < height * 0.1; j++) {
          if (grid[i][j]) {
            drawPixel("black", contextRef.current, i, j);
          } else {
            drawPixel("white", contextRef.current, i, j);
          }
        }
      }
      for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
              neighborArray[i][j] = scan(grid, i, j)
              valueArray[i][j] = grid[i][j]
          }
      }
      console.table(valueArray);
      console.table(neighborArray);
  }
  return (
    <canvas
      id="learningCanvas"
      onMouseDown={draw}
      onKeyDown={iterate}
      ref={canvasRef}
    />
  );
}



function makeGrid(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function randomizeGrid(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      let random = Math.floor(Math.random() * 2);
      if (random < 1) {
        arr[i][j] = 1;
      } else {
        arr[i][j] = 0;
      }
    }
  }
}

function scan(grid, x, y) {
  let count = 0;
  //   let miniArray = [];
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      // miniArray.push(arr[x+i][y+j])
      let col = (x + i + 120) % 120;
      let row = (y + j + 80) % 80;
      count += grid[col][row]
    }
  }
  count -= grid[x][y];
  //   console.log("lastVal:",arr[x][y],"x,y", x, ",", y, "miniArray:", miniArray)
  return count;
}

function drawPixel(color, canvas, i, j) {
  canvas.fillStyle = color;
  canvas.fillRect(i * 10 + 2, j * 10 + 2, 8, 8);
}
