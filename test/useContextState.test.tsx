import * as React from "react";
import { render, fireEvent } from "react-testing-library";
import { Provider, useContextState } from "../src";

test("local state", () => {
  const Counter = () => {
    const [count, setCount] = useContextState(null, 0);
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

test("re-render only for the key", () => {
  let rerenders1 = 0;
  let rerenders2 = 0;
  const Component1 = () => {
    const [, setState] = useContextState("foo");
    React.useMutationEffect(() => {
      rerenders1 += 1;
    });
    return <button onClick={() => setState(1)}>button1</button>;
  };
  const Component2 = () => {
    const [, setState] = useContextState("bar");
    React.useMutationEffect(() => {
      rerenders2 += 1;
    });
    return <button onClick={() => setState(1)}>button2</button>;
  };
  const App = () => (
    <Provider>
      <Component1 />
      <Component2 />
    </Provider>
  );
  const { getByText } = render(<App />);
  expect(rerenders1).toBe(1);
  expect(rerenders2).toBe(1);
  fireEvent.click(getByText("button1"));
  expect(rerenders1).toBe(2);
  expect(rerenders2).toBe(1);
});
