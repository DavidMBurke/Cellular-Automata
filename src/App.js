import React from "react";
import "./Style.css";
import GameOfLife from "./GameOfLife.js";

function App() {
  return (
    <div>
      <nav>
        <h1 className={"banner"}>Exploration of Cellular Automata</h1>
        <div className="horizontal">
          <button className={"nav-button"}>Falling Sand</button>
          <button className={"nav-button"}>Conway's Game of Life</button>
          <button className={"nav-button"}>
            Wolfram's 1-Dimensional Cellular Automata
          </button>
          <button className={"nav-button"}>Langston's Ant</button>
        </div>
      </nav>
      <div className={"columns"}>
        <div className={"info"}>
          <button className={"settings-button"}>Save</button>
          <button className={"settings-button"}>Load</button>
        </div>
        <GameOfLife id="learningCanvas" />

        <div className={"settings"}>
          <button className={"settings-button"}>Start</button>
          <button className={"settings-button"}>Stop</button>
          <button className={"settings-button"}>Step</button>
          <h3>Speed: *val* FPS</h3>
          <div>
            <div className="slidecontainer">
              <input
                type="range"
                min="0"
                max="25"
                value="5"
                className="slider"
                id="speedSlider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
