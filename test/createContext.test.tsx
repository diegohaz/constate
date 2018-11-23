import * as React from "react";
import { render, fireEvent } from "react-testing-library";
import { createContext } from "../src";

const {
  Context,
  Provider,
  useContextState,
  useContextReducer,
  unstable_useContextEffect: useContextEffect,
  unstable_useContextLayoutEffect: useContextLayoutEffect,
  unstable_useContextMutationEffect: useContextMutationEffect
} = createContext({
  counter1: 0,
  foo: "foo",
  bar: {
    count: 0
  }
});

test("Context without Provider", () => {
  const Counter = () => {
    const [state, setState] = React.useContext(Context);
    return (
      <button
        onClick={() => setState({ ...state, counter1: state.counter1 + 1 })}
      >
        {state.counter1}
      </button>
    );
  };
  const { getByText } = render(<Counter />);
  fireEvent.click(getByText("0"));
  expect(getByText("0")).toBeDefined();
});

test("Context", () => {
  const Counter = () => {
    const [state, setState] = React.useContext(Context);
    return (
      <button
        onClick={() => setState({ ...state, counter1: state.counter1 + 1 })}
      >
        {state.counter1}
      </button>
    );
  };
  const App = () => (
    <Provider>
      <Counter />
    </Provider>
  );
  const { getByText } = render(<App />);
  fireEvent.click(getByText("0"));
  expect(getByText("1")).toBeDefined();
});

test("useContextState", () => {
  const Component = () => {
    const [state, setState] = useContextState("foo");
    return <button onClick={() => setState("bar")}>{state}</button>;
  };
  const App = () => (
    <Provider>
      <Component />
    </Provider>
  );
  const { getByText } = render(<App />);
  fireEvent.click(getByText("foo"));
  expect(getByText("bar")).toBeDefined();
});

test("useContextReducer", () => {
  const reducer = (
    state: { count: number },
    action: { type: "INCREMENT" | "DECREMENT" }
  ) => {
    switch (action.type) {
      case "INCREMENT":
        return { count: state.count + 1 };
      case "DECREMENT":
        return { count: state.count - 1 };
      default:
        return state;
    }
  };
  const Counter = () => {
    const [state, dispatch] = useContextReducer("bar", reducer);
    return (
      <button onClick={() => dispatch({ type: "INCREMENT" })}>
        {state.count}
      </button>
    );
  };
  const App = () => (
    <Provider>
      <Counter />
    </Provider>
  );
  const { getByText } = render(<App />);
  fireEvent.click(getByText("0"));
  expect(getByText("1")).toBeDefined();
});

test("useContextEffect", () => {
  let count = 0;
  const Component1 = () => {
    useContextEffect("foo", () => {
      count += 1;
    });
    return null;
  };
  const Component2 = () => {
    useContextEffect("foo", () => {
      count += 1;
    });
    return null;
  };
  const App = () => (
    <Provider>
      <Component1 />
      <Component2 />
    </Provider>
  );
  const { rerender } = render(<App />);
  expect(count).toBe(0);
  rerender(<App />);
  expect(count).toBe(1);
  rerender(<App />);
  expect(count).toBe(2);
});

test("useContextLayoutEffect", () => {
  let count = 0;
  const Component1 = () => {
    useContextLayoutEffect("foo", () => {
      count += 1;
    });
    return null;
  };
  const Component2 = () => {
    useContextLayoutEffect("foo", () => {
      count += 1;
    });
    return null;
  };
  const App = () => (
    <Provider>
      <Component1 />
      <Component2 />
    </Provider>
  );
  const { rerender } = render(<App />);
  expect(count).toBe(1);
  rerender(<App />);
  expect(count).toBe(2);
  rerender(<App />);
  expect(count).toBe(3);
});

test("useContextMutationEffect", () => {
  let count = 0;
  const Component1 = () => {
    useContextMutationEffect("foo", () => {
      count += 1;
    });
    return null;
  };
  const Component2 = () => {
    useContextMutationEffect("foo", () => {
      count += 1;
    });
    return null;
  };
  const App = () => (
    <Provider>
      <Component1 />
      <Component2 />
    </Provider>
  );
  const { rerender } = render(<App />);
  expect(count).toBe(1);
  rerender(<App />);
  expect(count).toBe(2);
  rerender(<App />);
  expect(count).toBe(3);
});

test("non object context", () => {
  const Count = createContext(0);
  const Counter = () => {
    const [count, setCount] = React.useContext(Count.Context);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  };
  const App = () => (
    <Count.Provider>
      <Counter />
    </Count.Provider>
  );
  const { getByText } = render(<App />);
  fireEvent.click(getByText("0"));
  expect(getByText("1")).toBeDefined();
});

test("null calculateChangedBits", () => {
  const Count = createContext(0, null);
  const Counter = () => {
    const [count, setCount] = React.useContext(Count.Context);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  };
  const App = () => (
    <Count.Provider>
      <Counter />
    </Count.Provider>
  );
  const { getByText } = render(<App />);
  fireEvent.click(getByText("0"));
  expect(getByText("1")).toBeDefined();
});
