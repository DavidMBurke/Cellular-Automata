import React from "react";
import "./Style.css";
import Canvas from "./Canvas.js";

function App() {
  return (
    <div>
      <nav>
        <h1>Exploration of Cellular Automata</h1>
      </nav>
      <columns>
      <Canvas id="learningCanvas" />
      <settings>
        This is where settings will go
      </settings>
      </columns>
    </div>
  );
}

export default App;
