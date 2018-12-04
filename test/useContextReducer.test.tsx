import * as React from "react";
import { render, fireEvent } from "react-testing-library";
import { Provider, useContextReducer } from "../src";

function reducer(state: number, action: { type: "INCREMENT" | "DECREMENT" }) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
}

test("local reducer", () => {
  const Counter = () => {
    const [count, dispatch] = useContextReducer(null, reducer, 0);
    return (
      <button onClick={() => dispatch({ type: "INCREMENT" })}>{count}</button>
    );
  };
  const { getByText } = render(<Counter />);
  fireEvent.click(getByText("0"));
  expect(getByText("1")).toBeDefined();
});

test("shared reducer", () => {
  const useCounter = () => useContextReducer("counter1", reducer, 0);
  const Button = () => {
    const [, dispatch] = useCounter();
    return (
      <button onClick={() => dispatch({ type: "INCREMENT" })}>Button</button>
    );
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

test("local initialAction", () => {
  const Counter = () => {
    const [count, dispatch] = useContextReducer(null, reducer, 0, {
      type: "INCREMENT"
    });
    return (
      <button onClick={() => dispatch({ type: "INCREMENT" })}>{count}</button>
    );
  };
  const { getByText } = render(<Counter />);
  fireEvent.click(getByText("1"));
  expect(getByText("2")).toBeDefined();
});

test("shared initialAction", () => {
  const reducerSpy = jest.fn(reducer) as typeof reducer;
  const useCounter = () =>
    useContextReducer("counter1", reducerSpy, 0, { type: "INCREMENT" });
  const Button = () => {
    const [, dispatch] = useCounter();
    return (
      <button onClick={() => dispatch({ type: "INCREMENT" })}>Button</button>
    );
  };
  const Value = () => {
    const [count] = useCounter();
    return <span>{count}</span>;
  };
  const App = () => (
    <Provider>
      <Button />
      <Value />
      <Value />
    </Provider>
  );
  const { getByText } = render(<App />);
  expect(getByText("1")).toBeDefined();
  fireEvent.click(getByText("Button"));
  expect(getByText("2")).toBeDefined();
  expect(reducerSpy).toHaveBeenCalledTimes(2);
});
