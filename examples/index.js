import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Counter from "./counter";

const App = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/counter">Counter</Link>
        </li>
      </ul>
      <hr />
      <Route path="/counter" component={Counter} />
    </div>
  </Router>
);

render(<App />, document.getElementById("root"));
