import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import createContextHook from "../src";

function useCounter({ initialCount = 0 } = {}) {
  const [count, setCount] = React.useState(initialCount);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

test("default", () => {
  const Container = createContextHook(useCounter);
  const Increment = () => {
    const { increment } = React.useContext(Container.Context);
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const { count } = React.useContext(Container.Context);
    return <div>{count}</div>;
  };
  const App = () => (
    <Container.Provider>
      <Increment />
      <Count />
    </Container.Provider>
  );
  const { getByText } = render(<App />);
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("1")).toBeDefined();
});

test("default - using return as hook", () => {
  const useCounterContainer = createContextHook(useCounter);
  const Increment = () => {
    const { increment } = useCounterContainer();
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const { count } = useCounterContainer();
    return <div>{count}</div>;
  };
  const App = () => (
    <useCounterContainer.Provider>
      <Increment />
      <Count />
    </useCounterContainer.Provider>
  );
  const { getByText } = render(<App />);
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("1")).toBeDefined();
});

test("createMemoDeps", () => {
  const Container = createContextHook(useCounter, value => [value.count]);
  const Increment = () => {
    const { increment } = React.useContext(Container.Context);
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const { count } = React.useContext(Container.Context);
    return <div>{count}</div>;
  };
  const App = () => (
    <Container.Provider>
      <Increment />
      <Count />
    </Container.Provider>
  );
  const { getByText } = render(<App />);
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("1")).toBeDefined();
});

test("empty createMemoDeps", () => {
  const Container = createContextHook(useCounter, () => []);
  const Increment = () => {
    const { increment } = React.useContext(Container.Context);
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const { count } = React.useContext(Container.Context);
    return <div>{count}</div>;
  };
  const App = () => (
    <Container.Provider>
      <Increment />
      <Count />
    </Container.Provider>
  );
  const { getByText } = render(<App />);
  expect(getByText("0")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("0")).toBeDefined();
});

test("provider props", () => {
  const Container = createContextHook(useCounter);
  const Increment = () => {
    const { increment } = React.useContext(Container.Context);
    return <button onClick={increment}>Increment</button>;
  };
  const Count = () => {
    const { count } = React.useContext(Container.Context);
    return <div>{count}</div>;
  };
  const App = () => (
    <Container.Provider initialCount={10}>
      <Increment />
      <Count />
    </Container.Provider>
  );
  const { getByText } = render(<App />);
  expect(getByText("10")).toBeDefined();
  fireEvent.click(getByText("Increment"));
  expect(getByText("11")).toBeDefined();
});

test("displayName with named hook", () => {
  const Container = createContextHook(useCounter);
  expect(Container.Provider.displayName).toBe("useCounter.Provider");
  expect(Container.Context.displayName).toBe("useCounter.Context");
});

test("displayName with anonymous hook", () => {
  const Container = createContextHook(() => {});
  expect(Container.Provider.displayName).toBeUndefined();
  expect(Container.Context.displayName).toBeUndefined();
});
