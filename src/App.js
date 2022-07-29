import React from "react";
import ReactDOM from "react-dom"; 
import "./Style.css";
import GameOfLife from "./GameOfLife/GameOfLife.js";
import LangtonsAnt from "./LangtonsAnt/LangtonsAnt";
import Wolfram from "./Wolfram/Wolfram";
import FallingSand from "./FallingSand/FallingSand";
import { Link, Route, Routes, BrowserRouter as Router } from 'react-router-dom';

function App() {
  return(
    <Router>
    <div>
      <nav>
        <h1 className={"banner"}>Exploration of Cellular Automata</h1>
        <div className="horizontal">
          <Link to="/falling-sand">
          <button className={"nav-button"}>Falling Sand</button>
          </Link>
          <Link to="/game-of-life">
          <button className={"nav-button"}>Conway's Game of Life</button>
          </Link>
          <Link to="/wolframs">
          <button className={"nav-button"}>
            Wolfram's 1-Dimensional Cellular Automata
          </button>
          </Link>
          <Link to="/langtons-ant">
          <button className={"nav-button"}>Langton's Ant</button>
          </Link>
        </div>
      </nav>
      <Routes>
        <Route path="/langtons-ant" element={<LangtonsAnt id="langtonCanvas"/>} />
        <Route path="/game-of-life" element={<GameOfLife id="conwayCanvas"/>} />
        <Route path="/wolframs" element={<Wolfram id="wolframCanvas"/>} />
        <Route path="/falling-sand" element={<FallingSand id="fallingSandCanvas"/>} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
