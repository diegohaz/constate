import * as React from "react";
import { render, fireEvent } from "react-testing-library";
import { Provider, useContextState, useContextKey } from "../src";

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
    const [, setCount] = useCounter();
    return (
      <button onClick={() => setCount(prevCount => prevCount + 1)}>
        Button
      </button>
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

test("lazy initialization", () => {
  const useCounter = () => useContextState("counter1", () => 0);
  const Button = () => {
    const [, setCount] = useCounter();
    return (
      <button onClick={() => setCount(prevCount => prevCount + 1)}>
        Button
      </button>
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

test("useContextKey", () => {
  const useCounter = () => {
    const key = useContextKey("counter1");
    return useContextState(key, 0);
  };
  const Button = () => {
    const [, setCount] = useCounter();
    return (
      <button onClick={() => setCount(prevCount => prevCount + 1)}>
        Button
      </button>
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

test("re-render only for the key", () => {
  let rerenders1 = 0;
  let rerenders2 = 0;
  const Component1 = () => {
    const [, setState] = useContextState("foo");
    React.useLayoutEffect(() => {
      rerenders1 += 1;
    });
    return <button onClick={() => setState(1)}>button1</button>;
  };
  const Component2 = () => {
    const [, setState] = useContextState("bar");
    React.useLayoutEffect(() => {
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

test("re-render with 29 keys", () => {
  const amount = 29;
  let rerenders = 0;
  const Component = ({ index }: { index: number }) => {
    const [count, setState] = useContextState(`${index}`, 0);
    React.useLayoutEffect(() => {
      rerenders += 1;
    });
    return <button onClick={() => setState(count + 1)}>{index}</button>;
  };
  const App = () => (
    <Provider>
      {Array(amount)
        .fill(0)
        .map((_, i) => (
          <Component key={i} index={i} />
        ))}
    </Provider>
  );
  const { getByText } = render(<App />);
  // renders twice to set initial state
  expect(rerenders).toBe(amount * 2);
  // click on the first button
  fireEvent.click(getByText("0"));
  expect(rerenders).toBe(amount * 2 + 1);
  fireEvent.click(getByText("0"));
  expect(rerenders).toBe(amount * 2 + 2);
});

test("re-render with 30 keys", () => {
  const amount = 30;
  let rerenders = 0;
  const Component = ({ index }: { index: number }) => {
    const [count, setState] = useContextState(`${index}`, 0);
    React.useLayoutEffect(() => {
      rerenders += 1;
    });
    return <button onClick={() => setState(count + 1)}>{index}</button>;
  };
  const App = () => (
    <Provider>
      {Array(amount)
        .fill(0)
        .map((_, i) => (
          <Component key={i} index={i} />
        ))}
    </Provider>
  );
  const { getByText } = render(<App />);
  expect(rerenders).toBe(amount * 2);
  fireEvent.click(getByText("0"));
  expect(rerenders).toBe(amount * 2 + 2);
  fireEvent.click(getByText("0"));
  expect(rerenders).toBe(amount * 2 + 4);
});
