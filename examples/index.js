import React from "react";
import ReactDOM from "react-dom";
import { Router, Link } from "@reach/router";
import Counter from "./counter/App";

const paths = {
  counter: Counter
};

const App = () => (
  <div style={{ display: "flex" }}>
    <ul style={{ flex: 0 }}>
      {Object.keys(paths).map(path => (
        <li key={path}>
          <Link to={path}>{path}</Link>
        </li>
      ))}
    </ul>
    <div style={{ margin: 16 }}>
      <Router>
        {Object.entries(paths).map(([path, Component]) => (
          <Component key={path} path={path} />
        ))}
      </Router>
    </div>
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
