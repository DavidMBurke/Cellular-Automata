import React, { useState, useEffect, useRef } from "react";
export default function GameOfLife() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const width = 800;
  const height = 600;
  let grid = makeGrid(width * 0.2, height * 0.2);
  let fps = 5;
  let row = [0];
  let interval;
  let animated = false;
  const [case000, setCase000] = useState(false);
  const [case001, setCase001] = useState(true);
  const [case010, setCase010] = useState(true);
  const [case011, setCase011] = useState(true);
  const [case100, setCase100] = useState(true);
  const [case101, setCase101] = useState(false);
  const [case110, setCase110] = useState(false);
  const [case111, setCase111] = useState(false);

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
    for (let i = 5; i < width; i += 5)
      contextRef.current.fillRect(i, 0, 1, height);
    for (let i = 5; i < height; i += 5)
      contextRef.current.fillRect(0, i, width, 1);
    contextRef.current.fillRect(0, 0, 2, height);
    contextRef.current.fillRect(1198, 0, 2, height);
    contextRef.current.fillRect(0, 0, width, 2);
    contextRef.current.fillRect(0, 798, width, 2);
    clear(grid, contextRef.current, row);
  }, []);

  const draw = ({ nativeEvent }) => {
    const { offsetX } = nativeEvent;
    let x = Math.floor(offsetX * 0.2);
    let y = Math.floor(row);
    if (grid[x][y] === 1) {
      grid[x][y] = 0;
      drawPixel("white", contextRef.current, x, y);
    } else {
      grid[x][y] = 1;
      drawPixel("black", contextRef.current, x, y);
    }
  };

  const animate = () => {
    if (animated) return;
    interval = setInterval(() => {
      iterate(
        grid,
        row,
        contextRef.current,
        case000,
        case001,
        case010,
        case011,
        case100,
        case101,
        case110,
        case111
      );
      if (row > 120) stopAnimation();
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
        <a href="https://mathworld.wolfram.com/ElementaryCellularAutomaton.html" target="_blank">
          <button className={"settings-button"}>How it Works</button>
        </a>
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
            iterate(
              grid,
              row,
              contextRef.current,
              case000,
              case001,
              case010,
              case011,
              case100,
              case101,
              case110,
              case111
            );
          }}
        >
          Step
        </button>
        <button
          className={"settings-button"}
          onClick={() => {
            clear(grid, contextRef.current, row);
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
        <div className="columns">
          <div className="wolfram-options">
            <div>⬜ ⬜ ⬜</div>{" "}
            <input
              type="checkbox"
              checked={case000}
              onChange={() => setCase000(!case000)}
            />
            <div>⬜ ⬜ ⬛</div>{" "}
            <input
              type="checkbox"
              checked={case001}
              onChange={() => setCase001(!case001)}
            />
            <div>⬜ ⬛ ⬜</div>{" "}
            <input
              type="checkbox"
              checked={case010}
              onChange={() => setCase010(!case010)}
            />
            <div>⬜ ⬛ ⬛</div>{" "}
            <input
              type="checkbox"
              checked={case011}
              onChange={() => setCase011(!case011)}
            />
          </div>
          <div className="wolfram-options">
            <div>⬛ ⬜ ⬜</div>{" "}
            <input
              type="checkbox"
              checked={case100}
              onChange={() => {
                setCase100(!case100);
                console.log(case100);
              }}
            />
            <div>⬛ ⬜ ⬛ </div>{" "}
            <input
              type="checkbox"
              checked={case101}
              onChange={() => setCase101(!case101)}
            />
            <div>⬛ ⬛ ⬜</div>{" "}
            <input
              type="checkbox"
              checked={case110}
              onChange={() => setCase110(!case110)}
            />
            <div>⬛ ⬛ ⬛</div>{" "}
            <input
              type="checkbox"
              checked={case111}
              onChange={() => setCase111(!case111)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const clear = (grid, canvas, row) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j] = 0;
      if (j === 0) drawPixel("white", canvas, i, j);
      else drawPixel("grey", canvas, i, j);
    }
  }
  row[0] = 0;
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

function scan(grid, x, y) {
  let upLeft = grid[(x + 159) % 160][y - 1];
  let upMid = grid[x][y - 1];
  let upRight = grid[(x + 1) % 160][y - 1];
  return "" + upLeft + upMid + upRight;
}

function iterate(
  grid,
  row,
  canvas,
  case000,
  case001,
  case010,
  case011,
  case100,
  case101,
  case110,
  case111
) {
  row[0]++;
  let j = row[0];
  let active = false;
  for (let i = 0; i < grid.length; i++) {
    const val = scan(grid, i, j);
    switch (val) {
      case "000": {
        active = case000;
        break;
      }
      case "001": {
        active = case001;
        break;
      }
      case "010": {
        active = case010;
        break;
      }
      case "011": {
        active = case011;
        break;
      }
      case "100": {
        active = case100;
        break;
      }
      case "101": {
        active = case101;
        break;
      }
      case "110": {
        active = case110;
        break;
      }
      case "111": {
        active = case111;
        break;
      }
      default: {
        console.log("Broken Switch: val= ", val);
      }
    }
    if (active) {
      drawPixel("black", canvas, i, j);
      grid[i][j] = 1;
    } else {
      drawPixel("white", canvas, i, j);
    }
  }
}

function drawPixel(color, canvas, i, j) {
  canvas.fillStyle = color;
  canvas.fillRect(i * 5 + 1, j * 5 + 1, 4, 4);
}
