import React, { useState } from "react";
import { createContextHook } from "constate";
import { GithubPicker } from "react-color";

const useThemeContext = createContextHook(props =>
  useState(props.initialColor)
);
const usePickerVisibilityContext = createContextHook(() => useState(false));

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
  const [background] = useThemeContext();
  const [visible, setVisible] = usePickerVisibilityContext();
  return (
    <button style={{ background }} onClick={() => setVisible(!visible)}>
      Select color: {background}
    </button>
  );
}

function App() {
  return (
    <useThemeContext.Provider initialColor="red">
      <usePickerVisibilityContext.Provider>
        <Button />
        <Picker />
      </usePickerVisibilityContext.Provider>
    </useThemeContext.Provider>
  );
}

export default App;
