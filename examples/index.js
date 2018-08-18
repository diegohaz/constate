import React from "react";
import { render } from "react-dom";
import { Block, Link, List, Divider } from "reakit";
import {
  BrowserRouter as Router,
  Route,
  Link as RouterLink
} from "react-router-dom";
import Counter from "./counter";

const App = () => (
  <Router>
    <Block fontFamily="sans-serif">
      <List>
        <li>
          <Link as={RouterLink} to="/counter">
            Counter
          </Link>
        </li>
      </List>
      <Divider />
      <Route path="/counter" component={Counter} />
    </Block>
  </Router>
);

render(<App />, document.getElementById("root"));
