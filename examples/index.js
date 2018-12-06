import React from "react";
import ReactDOM from "react-dom";
import { Router, Link } from "@reach/router";
import Counter from "./counter/App";
import I18n from "./i18n/App";
import Theming from "./theming/App";
import TypeScript from "./typescript/App";
import WizardForm from "./wizard-form/App";

const paths = {
  counter: Counter,
  i18n: I18n,
  theming: Theming,
  typescript: TypeScript,
  "wizard-form": WizardForm
};

const App = () => (
  <div style={{ display: "flex" }}>
    <ul style={{ flex: 0, whiteSpace: "nowrap" }}>
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
