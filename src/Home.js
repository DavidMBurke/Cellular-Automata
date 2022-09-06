import React from "react";

export default function Home() {
  return (
    <div className="home-view">
      <h1>Welcome to David Burke's Exploration of Cellular Automata!</h1>
      <h3>About:</h3>
      <h4>
        This website showcases a selection of Cellular Automata, including
        Conway's Game of Life, Langton's Ant, Wolfram's One-Dimensional
        Automata, and a Falling Sand element simulator game. This project is a
        continued work in progress among many other projects which I will
        continue to update and improve. If you see any bugs, or ideas for
        features you would like to see, or are interested in other projects I'm
        working on, feel free to reach out to me on LinkedIn:

        <a
          className="imbedded-link"
          href="https://www.linkedin.com/in/David-M-Burke"
          target="_blank"
        > <br/> <br/>
          https://www.linkedin.com/in/David-M-Burke
        </a>
        .
      </h4>
      <h3>Upcoming features:</h3>
      <h4>
        Add infographics with rules and explanation of how each applet works on
        each page to replace links to wiki articles.
      </h4>
      <h4>Make save feature persist when you leave the applet.</h4>
      <h4>
        Add ability to make custom rules for Langton's Ant, Game of Life, and
        Falling Sand
      </h4>
    </div>
  );
}
