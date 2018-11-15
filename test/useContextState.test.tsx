import * as React from "react";
import { render, fireEvent } from "react-testing-library";
import { Provider, useContextState } from "../src";

test("local state", () => {
  const Counter = () => {
    const [count, setCount] = useContextState(undefined, 0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  };
  const { getByText } = render(<Counter />);
  fireEvent.click(getByText("0"));
  expect(getByText("1")).toBeDefined();
});

test("shared state", () => {
  const useCounter = () => useContextState("counter1", 0);
  const Button = () => {
    const [count, setCount] = useCounter();
    return <button onClick={() => setCount(count + 1)}>Button</button>;
  };
  const Value = () => {
    const [count] = useCounter();
    return <span>{count}</span>;
  };
  const App = () => (
    <Provider>
      <Button />
      <Value />
    </Provider>
  );
  const { getByText } = render(<App />);
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Button"));
  expect(getByText("1")).toBeDefined();
});
