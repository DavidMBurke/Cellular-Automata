import React from "react";
import "./Style.css";
//import GameOfLife from "./GameOfLife.js";
import LangtonsAnt from "./LangtonsAnt";

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
      <LangtonsAnt id="learningCanvas" />
      {/* <GameOfLife id="learningCanvas" /> */}
    </div>
  );
}

export default App;
