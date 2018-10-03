import React from "react";
import { render } from "react-dom";
import { Flex, Block, Link, List, Divider } from "reakit";
import {
  BrowserRouter as Router,
  Route,
  Link as RouterLink
} from "react-router-dom";
import Counter from "./counter";
import Nested from "./nested";

const routeMap = { Counter, Nested };

const App = () => (
  <Router>
    <Flex wrap fontFamily="sans-serif">
      <List>
        {Object.entries(routeMap).map(([key]) => (
          <li key={key}>
            <Link as={RouterLink} to={`/${key}`}>
              {key}
            </Link>
            <Divider vertical />
          </li>
        ))}
      </List>
      {Object.entries(routeMap).map(([key, value]) => (
        <Block margin="25px" key={key}>
          <Route path={`/${key}`} component={value} />
        </Block>
      ))}
    </Flex>
  </Router>
);

render(<App />, document.getElementById("root"));
