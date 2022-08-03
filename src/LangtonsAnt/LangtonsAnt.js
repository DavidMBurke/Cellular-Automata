import React, { useState, useEffect, useRef } from "react";
export default function LangtonsAnt() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const width = 800;
  const height = 600;
  let grid = makeGrid(width * 0.2, height * 0.2);
  const ants = [];
  let fps = 100;
  let interval;
  let animated = false;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width;
    canvas.style.height = height;

    const context = canvas.getContext("2d");
    console.log("context", context);
    console.log("canvas", canvas);
    context.scale(1, 1);
    context.lineCap = "butt";
    context.strokeStyle = "black";
    context.lineWidth = 1;
    contextRef.current = context;
  }, []);

  const createAnt = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    let x = Math.floor(offsetX * 0.2);
    let y = Math.floor(offsetY * 0.2);

    ants.push({
      x: x,
      y: y,
      direction: Math.floor(Math.random() * 4),
    });
    drawPixel("black", contextRef.current, x, y);
  };

  const animate = () => {
    if (animated) return;
    interval = setInterval(() => {
      iterate(ants, grid, contextRef.current);
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
        <a href="https://en.wikipedia.org/wiki/Langton%27s_ant" target="_blank">
          <button className={"settings-button"}>How it Works</button>
        </a>
      </div>

      <canvas id="learningCanvas" onMouseDown={createAnt} ref={canvasRef} />

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
            iterate(ants, grid, contextRef.current);
          }}
        >
          Step
        </button>
        <button
          className={"settings-button"}
          onClick={() => {
            clear(grid, contextRef.current, ants);
            stopAnimation();
          }}
        >
          Clear
        </button>
        <h3>Speed:</h3>
        <div>
          <div className="slidecontainer">
            <input
              id="speedSlider"
              type="range"
              min={25}
              max={250}
              step={25}
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
      </div>
    </div>
  );
}

const clear = (grid, canvas, ants) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j] = "white";
      drawPixel("white", canvas, i, j);
    }
  }
  ants.length = 0;
};

function makeGrid(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < arr[0].length; j++) {
      arr[i][j] = "white";
    }
  }
  return arr;
}

function iterate(ants, grid, canvas) {
  ants.forEach((ant) => {
    const turn = antMove(ant, grid, canvas);
    if (turn === "right") ant.direction = (ant.direction + 1) % 4;
    else ant.direction = (ant.direction + 3) % 4;
    switch (ant.direction) {
      case 0: {
        ant.y = (ant.y + 121) % 120;
        break;
      }
      case 1: {
        ant.x = (ant.x + 161) % 160;
        break;
      }
      case 2: {
        ant.y = (ant.y + 119) % 120;
        break;
      }
      case 3: {
        ant.x = (ant.x + 159) % 160;
        break;
      }
      default:
        console.log("switch error");
    }
  });
}

function antMove(ant, grid, canvas) {
  console.log("ant: ", ant);
  if (grid[ant.x][ant.y] === "black") {
    grid[ant.x][ant.y] = "white";
    drawPixel("white", canvas, ant.x, ant.y);
    return "right";
  } else {
    grid[ant.x][ant.y] = "black";
    drawPixel("black", canvas, ant.x, ant.y);
    return "left";
  }
}

function drawPixel(color, canvas, x, y) {
  console.log("canvas in drawPixel:", canvas);
  canvas.fillStyle = color;
  canvas.fillRect(x * 5, y * 5, 5, 5);
}
