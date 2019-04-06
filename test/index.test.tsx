import * as React from "react";
import { fireEvent, render } from "react-testing-library";
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

describe("useContainer", () => {
  test("with a Provider", () => {
    const Container = createContainer(useCounter);
    const Increment = () => {
      const { increment } = Container.useContainer({
        initialCount: 20 /* props ignored: supplied instead by Provider */
      });
      return <button onClick={increment}>Increment</button>;
    };
    const Count = () => {
      const { count } = Container.useContainer({
        initialCount: 30 /* propos ignored: supplied instead by Provider */
      });
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

  test("without a Provider in test env", () => {
    expect(process.env.NODE_ENV).toBe("test");
    const Container = createContainer(useCounter);
    const Increment = () => {
      const { increment } = Container.useContainer({ initialCount: 20 });
      return <button onClick={increment}>Increment</button>;
    };
    const Count = () => {
      const { count } = Container.useContainer({ initialCount: 30 });
      return <div>{count}</div>;
    };
    const App = () => (
      <>
        <Increment />
        <Count />
      </>
    );
    const { getByText } = render(<App />);
    expect(getByText("30")).toBeDefined();
    fireEvent.click(getByText("Increment"));
    expect(getByText("30")).toBeDefined();
  });

  test("without a Provider in production env", () => {
    try {
      process.env.NODE_ENV = "production";

      const Container = createContainer(useCounter);
      const Increment = () => {
        const { increment } = Container.useContainer({ initialCount: 20 });
        return <button onClick={increment}>Increment</button>;
      };
      const Count = () => {
        const { count } = Container.useContainer({ initialCount: 30 });
        return <div>{count}</div>;
      };
      const App = () => (
        <>
          <Increment />
          <Count />
        </>
      );
      withoutConsoleError(() =>
        expect(() => render(<App />)).toThrowError(/constate/)
      );
    } finally {
      process.env.NODE_ENV = "test";
    }
  });
});

function withoutConsoleError<T>(fn: () => T) {
  // alas, jest dumps error text as console.error, even inside an
  // expect().toThrow (see
  // https://github.com/facebook/jest/pull/5267#issuecomment-356605468),
  // so we temporarily silence console.error
  const consoleMock = jest.spyOn(console, "error").mockImplementation(() => {});
  try {
    return fn();
  } finally {
    consoleMock.mockRestore();
  }
}
