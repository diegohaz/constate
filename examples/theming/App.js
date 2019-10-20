import React, { useState } from "react";
import { GithubPicker } from "react-color";
import constate from "constate";

const [ThemeProvider, useThemeContext, useThemeColor] = constate(
  props => useState(props.initialColor),
  value => value,
  ([color]) => color
);
const [PickerVisibilityProvider, usePickerVisibilityContext] = constate(() =>
  useState(false)
);

function Picker() {
  const [color, setColor] = useThemeContext();
  const [visible, setVisible] = usePickerVisibilityContext();
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
  const background = useThemeColor();
  const [visible, setVisible] = usePickerVisibilityContext();
  return (
    <button style={{ background }} onClick={() => setVisible(!visible)}>
      Select color: {background}
    </button>
  );
}

function App() {
  return (
    <ThemeProvider initialColor="red">
      <PickerVisibilityProvider>
        <Button />
        <Picker />
      </PickerVisibilityProvider>
    </ThemeProvider>
  );
}

export default App;
