import { fireEvent, render } from "@testing-library/react";
import * as React from "react";
import { expect, test, vi } from "vitest";
import constate from "../src/index.tsx";

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
    (value) => value.count,
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
    (value) => value.increment,
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
    (value) => value.increment,
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
    (value) => React.useCallback(value.decrement, [value.count]),
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
  vi.spyOn(console, "warn").mockImplementation(() => {});
  const [, useCount] = constate(useCounter);
  const Count = () => {
    useCount();
    return null;
  };
  const App = () => <Count />;
  render(<App />);
  expect(console.warn).toHaveBeenCalledWith(
    "The context consumer of useCounter must be wrapped with its corresponding Provider",
  );
});

test("without the provider which is created by anonymous function", () => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  const [, useCount] = constate(() => useCounter());
  const Count = () => {
    useCount();
    return null;
  };
  const App = () => <Count />;
  render(<App />);
  expect(console.warn).toHaveBeenCalledWith(
    "Component must be wrapped with Provider.",
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
    (value) => value.count,
    (value) => value.increment,
  );
  expect(Provider.displayName).toBe("Constate");
});

// In the Fast Refresh tests below `simulateHmrCall(fn)` and
// `simulateHmrCallWithSelector(fn, sel)` stand in for an HMR re-evaluation:
// they invoke `constate(...)` from a fixed source line, so the caller
// location captured from `new Error().stack` matches between the two calls
// (as it would when the same module is re-executed by Vite). Direct
// `constate(useFoo)` calls in this file have distinct lines and therefore
// distinct cache keys, which is what the "two constate calls" test asserts.
function simulateHmrCall<Value>(useValue: () => Value) {
  return constate(useValue);
}

function simulateHmrCallWithSelector<Value, Selected>(
  useValue: () => Value,
  selector: (value: Value) => Selected,
) {
  return constate(useValue, selector);
}

test("reuses Provider and hooks across re-evaluations (Fast Refresh)", () => {
  function useTimer() {
    const [count, setCount] = React.useState(0);
    const tick = React.useCallback(() => setCount((c) => c + 1), []);
    return { count, tick };
  }
  const first = simulateHmrCall(useTimer);

  function useTimerReloaded() {
    const [count, setCount] = React.useState(0);
    const tick = React.useCallback(() => setCount((c) => c + 10), []);
    return { count, tick };
  }
  Object.defineProperty(useTimerReloaded, "name", { value: "useTimer" });
  const second = simulateHmrCall(useTimerReloaded as typeof useTimer);

  expect(second[0]).toBe(first[0]);
  expect(second[1]).toBe(first[1]);

  const Tick = () => {
    const { tick } = second[1]();
    return <button onClick={tick}>Tick</button>;
  };
  const Count = () => {
    const { count } = second[1]();
    return <div>{count}</div>;
  };
  const Provider = second[0];
  const { getByText } = render(
    <Provider>
      <Tick />
      <Count />
    </Provider>,
  );
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Tick"));
  expect(getByText("10")).toBeDefined();
});

test("creates a fresh Provider when useValue hook count changes (Fast Refresh)", () => {
  function useShape() {
    const [count] = React.useState(0);
    return { count };
  }
  const first = simulateHmrCall(useShape);

  function useShapeReloaded() {
    const [count] = React.useState(0);
    React.useEffect(() => {}, []);
    return { count };
  }
  Object.defineProperty(useShapeReloaded, "name", { value: "useShape" });
  const second = simulateHmrCall(useShapeReloaded as typeof useShape);

  expect(second[0]).not.toBe(first[0]);
  expect(second[1]).not.toBe(first[1]);
});

test("creates a fresh Provider when selector hook count changes (Fast Refresh)", () => {
  function useStore() {
    const [count, setCount] = React.useState(0);
    return { count, setCount };
  }
  const first = simulateHmrCallWithSelector(useStore, (value) => value.count);

  function useStoreReloaded() {
    const [count, setCount] = React.useState(0);
    return { count, setCount };
  }
  Object.defineProperty(useStoreReloaded, "name", { value: "useStore" });
  const second = simulateHmrCallWithSelector(
    useStoreReloaded as typeof useStore,
    (value) => React.useMemo(() => value.count, [value.count]),
  );

  expect(second[0]).not.toBe(first[0]);
  expect(second[1]).not.toBe(first[1]);
});

test("two constate calls on different lines in the same file are independent", () => {
  function useIndependent() {
    const [count] = React.useState(0);
    return { count };
  }
  const a = constate(useIndependent);
  const b = constate(useIndependent);
  expect(a[0]).not.toBe(b[0]);
  expect(a[1]).not.toBe(b[1]);
});

test("two constate calls on the same line are independent (column-distinct cache keys)", () => {
  function useSameLine() {
    const [count] = React.useState(0);
    return { count };
  }
  const pair = [constate(useSameLine), constate(useSameLine)];
  expect(pair[0][0]).not.toBe(pair[1][0]);
  expect(pair[0][1]).not.toBe(pair[1][1]);
});

test("skips the HMR cache for anonymous useValue", () => {
  const a = simulateHmrCall(() => React.useState(0));
  const b = simulateHmrCall(() => React.useState(0));
  expect(a[0]).not.toBe(b[0]);
  expect(a[1]).not.toBe(b[1]);
});
