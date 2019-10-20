import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import constate from "../src";

function useCounter({ initialCount = 0 } = {}) {
  const [count, setCount] = React.useState(initialCount);
  const increment = React.useCallback(() => setCount(c => c + 1), []);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement };
}

test("as object", () => {
  const { Provider, Context } = constate(useCounter);
  const Increment = () => {
    const { increment } = React.useContext(Context);
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const { count } = React.useContext(Context);
    return <div>{count}</div>;
  };
  const App = () => (
    <Provider>
      <Increment />
      <Count />
    </Provider>
  );
  const { getByText } = render(<App />);
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("1")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("2")).toBeDefined();
});

test("as hook", () => {
  const useCounterContext = constate(useCounter);
  const Increment = () => {
    const { increment } = useCounterContext();
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const { count } = useCounterContext();
    return <div>{count}</div>;
  };
  const App = () => (
    <useCounterContext.Provider initialCount={10}>
      <Increment />
      <Count />
    </useCounterContext.Provider>
  );
  const { getByText } = render(<App />);
  expect(getByText("10")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("11")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("12")).toBeDefined();
});

test("as hook with single split", () => {
  const useCounterContext = constate(useCounter, value => value.count);
  const Increment = () => {
    const { increment } = useCounterContext();
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const { count } = useCounterContext();
    return <div>{count}</div>;
  };
  const App = () => (
    <useCounterContext.Provider>
      <Increment />
      <Count />
    </useCounterContext.Provider>
  );
  const { getByText } = render(<App />);
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("1")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("2")).toBeDefined();
});

test("as hook with multiple split", () => {
  const useCounterContext = constate(
    useCounter,
    value => value.count,
    value => value.increment
  );
  const Increment = () => {
    const { increment } = useCounterContext();
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const { count } = useCounterContext();
    return <div>{count}</div>;
  };
  const App = () => (
    <useCounterContext.Provider>
      <Increment />
      <Count />
    </useCounterContext.Provider>
  );
  const { getByText } = render(<App />);
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("1")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("2")).toBeDefined();
});

test("as tuple", () => {
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

test("as tuple with single split", () => {
  const [CounterProvider, useCount] = constate(
    useCounter,
    value => value.count
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

test("as tuple with multiple split", () => {
  const [CounterProvider, useCount, useIncrement] = constate(
    useCounter,
    value => value.count,
    value => value.increment
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

test("as tuple with multiple split using hooks inside splitValue", () => {
  const [CounterProvider, useCount, useDecrement] = constate(
    useCounter,
    value => value.count,
    value => React.useCallback(value.decrement, [value.count])
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

test("createMemoDeps", () => {
  const useCounterContext = constate(useCounter, value => [value.count]);
  const Increment = () => {
    const { increment } = useCounterContext();
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const { count } = useCounterContext();
    return <div>{count}</div>;
  };
  const App = () => (
    <useCounterContext.Provider>
      <Increment />
      <Count />
    </useCounterContext.Provider>
  );
  const { getByText } = render(<App />);
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("1")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("2")).toBeDefined();
});

test("empty createMemoDeps", () => {
  const useCounterContext = constate(useCounter, () => []);
  const Increment = () => {
    const { increment } = useCounterContext();
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const { count } = useCounterContext();
    return <div>{count}</div>;
  };
  const App = () => (
    <useCounterContext.Provider>
      <Increment />
      <Count />
    </useCounterContext.Provider>
  );
  const { getByText } = render(<App />);
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("0")).toBeDefined();
});

test("without provider", () => {
  const [, useCount] = constate(useCounter);
  const Count = () => {
    const count = useCount();
    return <div>{count}</div>;
  };
  const App = () => <Count />;
  const { getByText } = render(<App />);
  expect(getByText("_NP_")).toBeDefined();
});

test("displayName with named hook", () => {
  const { Provider, Context } = constate(useCounter);
  expect(Provider.displayName).toBe("useCounter.Provider");
  expect(Context.displayName).toBe("useCounter.Context");
});

test("displayName with anonymous hook", () => {
  const { Provider, Context } = constate(() => {});
  expect(Provider.displayName).toBeUndefined();
  expect(Context.displayName).toBeUndefined();
});

test("displayName with named hook as tuple", () => {
  const [Provider] = constate(useCounter);
  expect(Provider.displayName).toBe("useCounter.Provider");
});

test("displayName with named hook as multiple tuples", () => {
  const [Provider] = constate(
    useCounter,
    value => value.count,
    value => value.increment
  );
  expect(Provider.displayName).toBe("useCounter.Provider");
});
