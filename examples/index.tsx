import React from "react";
import { render } from "react-dom";
import { Flex, Block, Link, List, Divider } from "reakit";
import {
  BrowserRouter as Router,
  Route,
  Link as RouterLink
} from "react-router-dom";

// Example Components
import Counter from "./counter";
import ContextCounter from "./ContextCounter";

// Route to Component mapping
// [0] Name and Route
// [1] Component
const routeMap: [string, React.ReactNode][] = [
  ["Counter", Counter],
  ["ContextCounter", ContextCounter]
];

const App = () => (
  <Router>
    <Flex wrap="true" fontFamily="sans-serif">
      <List>
        {routeMap.map(value => (
          <li key={value[0]}>
            <Link as={RouterLink} to={`/${value[0]}`}>
              {value[0]}
            </Link>
            <Divider vertical />
          </li>
        ))}
      </List>
      {routeMap.map(value => (
        <Block margin="25px" key={value[0]}>
          <Route path={`/${value[0]}`} component={value[1]} />
        </Block>
      ))}
    </Flex>
  </Router>
);

render(<App />, document.getElementById("root"));
