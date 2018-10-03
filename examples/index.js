import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Counter from "./counter";
import Nested from "./nested";

const routeMap = { Counter, Nested };

const App = () => (
  <Router>
    <div>
      <ul>
        {Object.entries(routeMap).map(([key]) => (
          <li key={key}>
            <Link to={`/${key}`}>{key}</Link>
          </li>
        ))}
      </ul>
      {Object.entries(routeMap).map(([key, value]) => (
        <div key={key}>
          <Route path={`/${key}`} component={value} />
        </div>
      ))}
    </div>
  </Router>
);

render(<App />, document.getElementById("root"));
