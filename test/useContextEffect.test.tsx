import * as React from "react";
import { render } from "react-testing-library";
import { Provider, useContextEffect } from "../src";

test("local effect", () => {
  const fn = jest.fn();
  const Counter = () => {
    useContextEffect(null, fn, []);
    return null;
  };
  const { rerender } = render(<Counter />);
  expect(fn).toBeCalledTimes(0);
  rerender(<Counter />);
  expect(fn).toBeCalledTimes(1);
  rerender(<Counter />);
  expect(fn).toBeCalledTimes(1);
});

test("shared effect", () => {
  const fn = jest.fn();
  const useCounter = () => {
    useContextEffect("counter1", fn);
  };
  const Component1 = () => {
    useCounter();
    return null;
  };
  const Component2 = () => {
    useCounter();
    return null;
  };
  const App = () => (
    <Provider>
      <Component1 />
      <Component2 />
    </Provider>
  );
  const { rerender } = render(<App />);
  expect(fn).toBeCalledTimes(0);
  rerender(<App />);
  expect(fn).toBeCalledTimes(1);
  rerender(<App />);
  expect(fn).toBeCalledTimes(2);
});
