# Migrating from `v0` to `v1`

### Table of Contents

- [Why did the API change?](#why-did-the-api-change)
- [How to update incrementally?](#how-to-update-incrementally)
- [`Container`](#container)
  - [`initialState`](#initialstate)
  - [`actions`](#actions)
  - [`selectors`](#selectors)
  - [`effects`](#effects)
  - [`context`](#context)
  - [`onMount`/`onUnmount`](#onmountonunmount)
  - [`onUpdate`](#onupdate)
  - [`shouldUpdate`](#shouldupdate)
- [`Provider`](#provider)
  - [`initialState`](#initialstate-1)
  - [`onMount`/`onUnmount`](#onmountonunmount-1)
  - [`onUpdate`](#onupdate-1)
  - [`devtools`](#devtools)

## Why did the API change?

Constate was born with the intention of making it easier to transform local state into context state (a.k.a. global or shared).

Before [React Hooks](https://reactjs.org/docs/hooks-intro.html), making stateful components was annoying, and turning local state into context wasn't as straight as it could be. And that's why many state management libraries came around.

With `<Container />`, we were solving those two problems. Writing local state became easier, and turning it into context was just a matter of changing a prop.

With the new [React.useState](https://reactjs.org/docs/hooks-reference.html#usestate), though, it turns out that writing local state is easier than ever – in fact, more than with `<Container />`. It wouldn't make sense to keep our API when React was already providing a better one.

However, scaling from local to context continues to be a problem. So Constate's API has been changed to focus on this.

## How to update incrementally?

First of all, if you don't want or have time to update your code, you should stick with `v0`. It's totally fine.

If you want to update your code incrementally, that is, update part of your code base while keeping others in the old version, you can re-create `<Container />` using the new hooks. See an [example](https://codesandbox.io/s/rw2mz784x4).

## `Container`

The `<Container />` component doesn't exist anymore. It's been replaced by [`useContextState`](https://github.com/diegohaz/constate#usecontextstate).

### `initialState`

#### v0
```jsx
import { Container } from "constate";

function Counter() {
  return (
    <Container initialState={{ count: 0 }}>
      {({ count }) => <button>{count}</button>}
    </Container>
  );
}
```

#### v1
```jsx
import { useContextState } from "constate";

function Counter() {
  // same as React.useState(0)
  const [count] = useContextState(null, 0);
  return <button>{count}</button>;
}
```

### `actions`

#### v0
```jsx
import { Container } from "constate";

function Counter() {
  return (
    <Container
      initialState={{ count: 0 }}
      actions={{
        increment: amount => state => ({ count: state.count + amount })
      }}
    >
      {({ count, increment }) => (
        <button onClick={() => increment(1)}>{count}</button>
      )}
    </Container>
  );
}
```

#### v1
```jsx
import { useContextState } from "constate";

function Counter() {
  // same as React.useState(0)
  const [count, setCount] = useContextState(null, 0);
  const increment = amount => setCount(count + 1);
  return <button onClick={() => increment(1)}>{count}</button>;
}
```

### `selectors`

#### v0
```jsx
import { Container } from "constate";

function Counter() {
  return (
    <Container
      initialState={{ count: 0 }}
      selectors={{
        getParity: () => state => (state.count % 2 === 0 ? "even" : "odd")
      }}
    >
      {({ getParity }) => (
        <button>{getParity()}</button>
      )}
    </Container>
  );
}
```

#### v1
```jsx
import { useContextState } from "constate";

function Counter() {
  // same as React.useState(0)
  const [count, setCount] = useContextState(null, 0);
  const getParity = () => (count % 2 === 0 ? "even" : "odd");
  return <button>{getParity()}</button>;
}
```

### `effects`

#### v0
```jsx
import { Container } from "constate";

function Counter() {
  return (
    <Container
      initialState={{ count: 0 }}
      effects={{
        tick: () => ({ setState }) => {
          const fn = () => setState(state => ({ count: state.count + 1 }));
          setInterval(fn, 1000);
        }
      }}
    >
      {({ count, tick }) => (
        <button onClick={tick}>{count}</button>
      )}
    </Container>
  );
}
```

#### v1
```jsx
import { useContextState } from "constate";

function Counter() {
  // same as React.useState(0)
  const [count, setCount] = useContextState(null, 0);
  const tick = () => {
    const fn = () => setCount(count + 1);
    setInterval(fn, 1000);
  }
  return <button onClick={tick}>{count}</button>;
}
```

### `context`

#### v0

```jsx
import { Provider, Container } from "constate";

function CounterContainer(props) {
  return (
    <Container
      initialState={{ count: 0 }}
      actions={{ increment: () => state => ({ count: state.count + 1 }) }}
      {...props}
    />
  );
}

function CounterButton() {
  return (
    <CounterContainer context="counter1">
      {({ increment }) => <button onClick={increment}>Increment</button>}
    </CounterContainer>
  );
}

function CounterValue() {
  return (
    <CounterContainer context="counter1">
      {({ count }) => <div>{count}</div>}
    </CounterContainer>
  );
}

function App() {
  return (
    <Provider>
      <CounterButton />
      <CounterValue />
    </Provider>
  );
}
```

#### v1

```jsx
import { Provider, useContextState } from "constate";

function useCounter(key) {
  const [count, setCount] = useContextState(key, 0);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

function CounterButton() {
  const { increment } = useCounter("counter1");
  return <button onClick={increment}>Increment</button>;
}

function CounterValue() {
  const { count } = useCounter("counter1");
  return <div>{count}</div>;
}

function App() {
  return (
    <Provider>
      <CounterButton />
      <CounterValue />
    </Provider>
  );
}
```

### `onMount`/`onUnmount`

#### v0

```jsx
import { Container } from "constate";

function Counter() {
  return (
    <Container
      initialState={{ count: 0 }}
      onMount={({ setState }) => {
        const fn = () => setState(state => ({ count: state.count + 1 }));
        const interval = setInterval(fn, 1000);
        setState({ interval });
      }}
      onUnmount={({ state }) => {
        clearInterval(state.interval);
      }}
    >
      {({ count }) => <button>{count}</button>}
    </Container>
  );
}
```

#### v1

```jsx
import { useContextKey, useContextState, useContextEffect } from "constate";

function Counter() {
  const key = useContextKey("counter1")
  const [count, setCount] = useContextState(key, 0);

  useContextEffect(key, () => {
    const fn = () => setCount(count + 1);
    const interval = setInterval(fn, 1000);
    return () => clearInterval(interval);
  }, []);

  return <button>{count}</button>;
}
```

### `onUpdate`

#### v0

```jsx
import { Container } from "constate";

function Counter() {
  return (
    <Container
      initialState={{ count: 0 }}
      onMount={({ setState }) => {
        const fn = () => setState(state => ({ count: state.count + 1 }));
        setInterval(fn, 1000);
      }}
      onUpdate={({ state, setState, type }) => {
        if (type === "onMount" && state.count === 5) {
          // reset counter
          setState({ count: 0 });
        }
      }}
    >
      {({ count }) => <button>{count}</button>}
    </Container>
  );
}
```

#### v1

`type` doesn't exist anymore.

```jsx
import { useContextKey, useContextState, useContextEffect } from "constate";

function Counter() {
  const key = useContextKey("counter1");
  const [count, setCount] = useContextState(key, 0);

  useContextEffect(key, () => {
    const fn = () => setCount(count + 1);
    setInterval(fn, 1000);
  }, []);

  useContextEffect(key, () => {
    if (count === 5) {
      // reset counter
      setCount(0);
    }
  }, [count]); // runs only when count changes

  return <button>{count}</button>;
}
```

### `shouldUpdate`

#### v0

```jsx
import { Container } from "constate";

function Counter() {
  return (
    <Container
      initialState={{ count: 0 }}
      shouldUpdate={() => false}
    >
      {({ count }) => <button>{count}</button>}
    </Container>
  );
}
```

#### v1

Just use [React.useMemo](https://reactjs.org/docs/hooks-reference.html#usememo).

```jsx
import { useMemo } from "react";
import { useContextState } from "constate";

function Counter() {
  const [count] = useContextState(null, 0);
  const children = useMemo(() => <button>{count}</button>, []);
  return children;
}
```

## `Provider`

### `initialState`

#### v0

```jsx
import { Provider } from "constate";

function App() {
  return (
    <Provider initialState={{ counter1: { count: 0 } }}>
      ...
    </Provider>
  );
}
```

#### v1

```js
// Context.js
import { createContext } from "constate";

const { Provider, useContextState } = createContext({
  counter1: 0
});

export { Provider, useContextState };
```

```jsx
// App.js
import { Provider } from "./Context";

function App() {
  return (
    <Provider>
      ...
    </Provider>
  );
}
```

### `onMount`/`onUnmount`

#### v0

```jsx
import { Provider } from "constate";

function App() {
  return (
    <Provider
      onMount={({ setContextState }) => {
        setContextState("counter1", { count: 0 });
      }}
      onUnmount={({ state }) => {
        console.log(state);
      }}
    >
      ...
    </Provider>
  );
}
```

#### v1

```jsx
import { useContext, useEffect } from "react";
import { Context, Provider } from "constate";

function AppEffects({ children }) {
  const [state, setState] = useContext(Context);

  useEffect(() => {
    setState({
      ...state,
      counter1: 0
    });
    return () => {
      console.log(state);
    }
  }, []);

  return children;
}

function App() {
  return (
    <Provider>
      <AppEffects>
        ...
      </AppEffects>
    </Provider>
  );
}
```

### `onUpdate`

#### v0

```jsx
import { Provider } from "constate";

function App() {
  return (
    <Provider
      onUpdate={({ context, type, setContextState }) => {
        if (context === "counter1" && type === "increment") {
          setContextState(context, state => ({
            incrementCalls: state.incrementCalls + 1
          }));
        }
      }}
    >
      ...
    </Provider>
  );
}
```

#### v1

`context` and `type` don't exist anymore.

```jsx
import { useContext, useEffect, useRef } from "react";
import { Context, Provider } from "constate";

function AppEffects({ children }) {
  const [state, setState] = useContext(Context);
  const prevState = useRef(null);

  useEffect(() => {
    // if (type === "increment")
    if (prevState.current && prevState.current.counter1 < state.counter1) {
      setState({
        ...state,
        incrementCalls: state.incrementCalls + 1
      })
    }

    prevState.current = state;
  }, [state.counter1]); // if (context === "counter1")

  useEffect(() => {
    prevState.current = state;
  }, [state]);

  return children;
}

function App() {
  return (
    <Provider>
      <AppEffects>
        ...
      </AppEffects>
    </Provider>
  );
}
```

### `devtools`

The API didn't change. The only difference now is that it's not displaying `type` anymore.