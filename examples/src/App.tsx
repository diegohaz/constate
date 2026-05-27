import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router";
import Counter from "./counter/App.tsx";
import I18n from "./i18n/App.tsx";
import Theming from "./theming/App.tsx";
import TypeScript from "./typescript/App.tsx";
import WizardForm from "./wizard-form/App.tsx";

const examples = {
  counter: Counter,
  i18n: I18n,
  theming: Theming,
  typescript: TypeScript,
  "wizard-form": WizardForm,
};

const paths = Object.keys(examples);
const entries = Object.entries(examples);
const defaultPath = paths[0];

export function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <ul style={{ flex: 0, whiteSpace: "nowrap" }}>
          {paths.map((path) => (
            <li key={path}>
              <Link to={`/${path}`}>{path}</Link>
            </li>
          ))}
        </ul>
        <div style={{ margin: 16 }}>
          <Routes>
            <Route
              path="/"
              element={<Navigate to={`/${defaultPath}`} replace />}
            />
            {entries.map(([path, Component]) => (
              <Route key={path} path={`/${path}`} element={<Component />} />
            ))}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
