import React from "react";
import { render } from "react-dom";
import { Block, Link, List, Divider } from "reas";
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
        <List.Item>
          <Link as={RouterLink} to="/counter">
            Counter
          </Link>
        </List.Item>
      </List>
      <Divider />
      <Route path="/counter" component={Counter} />
    </Block>
  </Router>
);

render(<App />, document.getElementById("root"));
