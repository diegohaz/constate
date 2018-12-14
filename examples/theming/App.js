import React, { useState, useContext } from "react";
import createContainer from "constate";
import { GithubPicker } from "react-color";

const Theme = createContainer(props => useState(props.initialColor));
const PickerVisibility = createContainer(() => useState(false));

function Picker() {
  const [color, setColor] = useContext(Theme.Context);
  const [visible, setVisible] = useContext(PickerVisibility.Context);
  return visible ? (
    <GithubPicker
      style={{ position: "absolute" }}
      triangle="hide"
      color={color}
      onChange={c => {
        setColor(c.hex);
        setVisible(false);
      }}
    />
  ) : null;
}

function Button() {
  const [background] = useContext(Theme.Context);
  const [visible, setVisible] = useContext(PickerVisibility.Context);
  return (
    <button style={{ background }} onClick={() => setVisible(!visible)}>
      Select color: {background}
    </button>
  );
}

function App() {
  return (
    <Theme.Provider initialColor="red">
      <PickerVisibility.Provider>
        <Button />
        <Picker />
      </PickerVisibility.Provider>
    </Theme.Provider>
  );
}

export default App;
