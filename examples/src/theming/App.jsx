import constate from "constate";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

const [ThemeProvider, useThemeContext, useThemeColor] = constate(
  (props) => useState(props.initialColor),
  (value) => value,
  ([color]) => color,
);
const [PickerVisibilityProvider, usePickerVisibilityContext] = constate(() =>
  useState(false),
);

function Picker() {
  const [color, setColor] = useThemeContext();
  const [visible] = usePickerVisibilityContext();
  return visible ? (
    <HexColorPicker
      style={{ position: "absolute" }}
      color={color}
      onChange={setColor}
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
    <ThemeProvider initialColor="#ff0000">
      <PickerVisibilityProvider>
        <Button />
        <Picker />
      </PickerVisibilityProvider>
    </ThemeProvider>
  );
}

export default App;
