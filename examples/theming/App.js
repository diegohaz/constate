import React from "react";
import { createContext } from "constate";
import { GithubPicker } from "react-color";

const { Provider, useContextState } = createContext({
  primary: "#d4c4fb",
  secondary: "#fad0c3"
});

function Picker({ kind }) {
  const [color, setColor] = useContextState(kind);
  const [on, setOn] = useContextState(`${kind}PickerVisibility`);
  return on ? (
    <GithubPicker
      style={{ position: "absolute" }}
      triangle="hide"
      color={color}
      onChange={c => {
        setColor(c.hex);
        setOn(false);
      }}
    />
  ) : null;
}

function Button({ kind }) {
  const [background] = useContextState(kind);
  const [on, setOn] = useContextState(`${kind}PickerVisibility`);
  return (
    <button style={{ background }} onClick={() => setOn(!on)}>
      Select {kind} color: {background}
    </button>
  );
}

function App() {
  return (
    <Provider devtools>
      <div>
        <Button kind="primary" />
        <Picker kind="primary" />
      </div>
      <div>
        <Button kind="secondary" />
        <Picker kind="secondary" />
      </div>
    </Provider>
  );
}

export default App;
