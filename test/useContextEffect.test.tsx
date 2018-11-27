import * as React from "react";
import { render } from "react-testing-library";
import { Provider, useContextKey, useContextEffect } from "../src";

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
    const key = useContextKey("counter1");
    useContextEffect(key, fn);
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

test("two shared effects", () => {
  const fn1 = jest.fn();
  const fn2 = jest.fn();
  const useCounter = () => {
    const key = useContextKey("counter1");
    useContextEffect(key, fn1);
    useContextEffect(key, fn2);
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
  expect(fn1).toBeCalledTimes(0);
  expect(fn2).toBeCalledTimes(0);
  rerender(<App />);
  expect(fn1).toBeCalledTimes(1);
  expect(fn2).toBeCalledTimes(1);
  rerender(<App />);
  expect(fn1).toBeCalledTimes(2);
  expect(fn2).toBeCalledTimes(2);
});
