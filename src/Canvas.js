import React, { useEffect, useState, useRef } from "react";
export default function Canvas() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const width = 800;
  const height = 600;
  let grid = makeGrid(width * 0.1, height * 0.1);
  let nextGrid = grid;
  randomizeGrid(grid);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width; //window.innerWidth * .5;
    canvas.height = height; //window.innerHeight * .5;
    canvas.style.width = width; //`${window.innerWidth} * .5 px`;
    canvas.style.height = height; //`${window.innerHeight} * .5 px`;

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
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();

    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    iterate(grid, nextGrid);
    grid = nextGrid;
    // randomizeGrid(grid);
    for (let i = 0; i < width * 0.1; i++) {
      for (let j = 0; j < height * 0.1; j++) {
        if (grid[i][j]) {
          drawPixel("black", contextRef.current, i, j);
        } else {
          drawPixel("white", contextRef.current, i, j);
        }
      }
    }
  };

  return (
    <canvas
      id="learningCanvas"
      onMouseDown={draw}
      onMouseUp={finishDrawing}
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
      let random = Math.floor(Math.random() * 4);
      if (random < 1) {
        arr[i][j] = 1;
      } else {
        arr[i][j] = 0;
      }
    }
  }
}

function iterate(arr, nextArr) {
  for (let i = 1; i < arr.length - 1; i++) {
    for (let j = 1; j < arr[0].length - 1; j++) {
      let count = scan(arr, i, j);
      if (arr[i][j] === 1) {
        if (count < 2 || count > 3) {
          nextArr[i][j] = 0;
        } else if (count === 2 || count === 3) {
          nextArr[i][j] = 1;
        } else {
          console.log("Something went wrong w/ live cells");
        }
      } else if (arr[i][j] === 0) {
        if (count === 3) {
          nextArr[i][j] = 1;
        } else {
          nextArr[i][j] = 0;
        }
      } else {
        console.log("ERROR! SOMETHING BROKEN", "arr[i][j] = ", arr[i][j]);
      }
    }
  }
}

function scan(arr, x, y) {
  let count = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (arr[x + i][y + j] === 1) {
        count++;
      }
    }
  }
  count -= arr[x][y];
  return count;
}

function drawPixel(color, canvas, i, j) {
  canvas.fillStyle = color;
  canvas.fillRect(i * 10 + 1, j * 10 + 1, 9, 9);
}
