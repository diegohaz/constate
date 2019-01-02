import * as React from "react";
import { render, fireEvent } from "react-testing-library";
import createContainer from "../src";

function useCounter({ initialCount = 0 } = {}) {
  const [count, setCount] = React.useState(initialCount);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

test("default", () => {
  const Container = createContainer(useCounter);
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

test("createMemoInputs", () => {
  const Container = createContainer(useCounter, value => [value.count]);
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

test("empty createMemoInputs", () => {
  const Container = createContainer(useCounter, () => []);
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
  const Container = createContainer(useCounter);
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
