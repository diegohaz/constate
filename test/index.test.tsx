import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import constate from "../src";

function useCounter({ initialCount = 0 } = {}) {
  const [count, setCount] = React.useState(initialCount);
  const increment = React.useCallback(() => setCount((c) => c + 1), []);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement };
}

test("no selectors", () => {
  const [CounterProvider, useCounterContext] = constate(useCounter);
  const Increment = () => {
    const { increment } = useCounterContext();
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const { count } = useCounterContext();
    return <div>{count}</div>;
  };
  const App = () => (
    <CounterProvider>
      <Increment />
      <Count />
    </CounterProvider>
  );
  const { getByText } = render(<App />);
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("1")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("2")).toBeDefined();
});

test("single selector", () => {
  const [CounterProvider, useCount] = constate(
    useCounter,
    (value) => value.count
  );
  const Count = () => {
    const count = useCount();
    return <div>{count}</div>;
  };
  const App = () => (
    <CounterProvider initialCount={10}>
      <Count />
    </CounterProvider>
  );
  const { getByText } = render(<App />);
  expect(getByText("10")).toBeDefined();
});

test("two selectors", () => {
  const [CounterProvider, useCount, useIncrement] = constate(
    useCounter,
    (value) => value.count,
    (value) => value.increment
  );
  const Increment = () => {
    const increment = useIncrement();
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const count = useCount();
    return <div>{count}</div>;
  };
  const App = () => (
    <CounterProvider initialCount={10}>
      <Increment />
      <Count />
    </CounterProvider>
  );
  const { getByText } = render(<App />);
  expect(getByText("10")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("11")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("12")).toBeDefined();
});

test("two selectors with inline useValue", () => {
  const [CounterProvider, useCount, useIncrement] = constate(
    ({ initialCount = 0 }: { initialCount?: number } = {}) => {
      const [count, setCount] = React.useState(initialCount);
      const increment = React.useCallback(() => setCount((c) => c + 1), []);
      const decrement = () => setCount(count - 1);
      return { count, increment, decrement };
    },
    (value) => value.count,
    (value) => value.increment
  );
  const Increment = () => {
    const increment = useIncrement();
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const count = useCount();
    return <div>{count}</div>;
  };
  const App = () => (
    <CounterProvider initialCount={10}>
      <Increment />
      <Count />
    </CounterProvider>
  );
  const { getByText } = render(<App />);
  expect(getByText("10")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("11")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("12")).toBeDefined();
});

test("two selectors with hooks inside them", () => {
  const [CounterProvider, useCount, useDecrement] = constate(
    useCounter,
    (value) => value.count,
    (value) => React.useCallback(value.decrement, [value.count])
  );
  const Decrement = () => {
    const decrement = useDecrement();
    return <button onClick={decrement}>Decrement</button>;
  };
  const Count = () => {
    const count = useCount();
    return <div>{count}</div>;
  };
  const App = () => (
    <CounterProvider initialCount={10}>
      <Decrement />
      <Count />
    </CounterProvider>
  );
  const { getByText } = render(<App />);
  expect(getByText("10")).toBeDefined();
  fireEvent.click(getByText("Decrement"));
  expect(getByText("9")).toBeDefined();
  fireEvent.click(getByText("Decrement"));
  expect(getByText("8")).toBeDefined();
});

test("without provider", () => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
  const [, useCount] = constate(useCounter);
  const Count = () => {
    useCount();
    return null;
  };
  const App = () => <Count />;
  render(<App />);
  // eslint-disable-next-line no-console
  expect(console.warn).toHaveBeenCalledWith(
    "Component must be wrapped with Provider."
  );
});

test("displayName with named useValue with no selector", () => {
  const [Provider] = constate(useCounter);
  expect(Provider.displayName).toBe("Constate");
});

test("displayName with anonymous useValue", () => {
  const [Provider] = constate(() => {});
  expect(Provider.displayName).toBeUndefined();
});

test("displayName with named useValue with selectors", () => {
  const [Provider] = constate(
    useCounter,
    // @ts-expect-error
    (value) => value.count,
    // @ts-expect-error
    (value) => value.increment
  );
  expect(Provider.displayName).toBe("Constate");
});
