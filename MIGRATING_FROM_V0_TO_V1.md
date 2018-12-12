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

With the new [`React.useState`](https://reactjs.org/docs/hooks-reference.html#usestate), though, it turns out that writing local state is easier than ever – in fact, more than with `<Container />`. It wouldn't make sense to keep our API when React was already providing a better one.

However, scaling from local to context continues to be a problem. So Constate's API has been changed to focus on this.

## How to update incrementally?

First of all, if you don't want or have time to update your code, you should stick with `v0`. It's totally fine.

If you want to update your code incrementally, that is, update part of your code base while keeping others in the old version, you can copy and paste the [source code](src/index.tsx) into your project and use it until you have updated the entire app.

## `Container`

The `<Container />` component doesn't exist anymore. It's been replaced by `createContainer`.

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

Just use [`React.useState`](https://reactjs.org/docs/hooks-reference.html#usestate):

```jsx
import { useState } from "react";

function Counter() {
  const [count] = useState(0);
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
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
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
      {({ getParity }) => <button>{getParity()}</button>}
    </Container>
  );
}
```

#### v1

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
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
      {({ count, tick }) => <button onClick={tick}>{count}</button>}
    </Container>
  );
}
```

#### v1

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const tick = () => {
    const fn = () => setCount(count + 1);
    setInterval(fn, 1000);
  };
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
import { useState, useContext } from "react";
import createContainer from "constate";

const Counter1 = createContainer(useCounter);

function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

function CounterButton() {
  const { increment } = useContext(Counter1.Context);
  return <button onClick={increment}>Increment</button>;
}

function CounterValue() {
  const { count } = useContext(Counter1.Context);
  return <div>{count}</div>;
}

function App() {
  return (
    <Counter1.Provider>
      <CounterButton />
      <CounterValue />
    </Counter1.Provider>
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
import { useState, useEffect, useContext } from "react";
import createContainer from "constate";

const Counter1 = createContainer(useCounter);

function useCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fn = () => setCount(count + 1);
    const interval = setInterval(fn, 1000);
    return () => clearInterval(interval);
  }, []);

  return count;
}

function Counter() {
  const count = useContext(Counter1.Context);
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
import { useState, useEffect, useContext } from "react";
import createContainer from "constate";

const Counter1 = createContainer(useCounter);

function useCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fn = () => setCount(count + 1);
    setInterval(fn, 1000);
  }, []);

  useEffect(
    () => {
      if (count === 5) {
        // reset counter
        setCount(0);
      }
    },
    [count] // runs only when count changes
  );

  return count;
}

function Counter() {
  const count = useContext(Counter1.Context);
  return <button>{count}</button>;
}
```

### `shouldUpdate`

#### v0

```jsx
import { Container } from "constate";

function Counter() {
  return (
    <Container initialState={{ count: 0 }} shouldUpdate={() => false}>
      {({ count }) => <button>{count}</button>}
    </Container>
  );
}
```

#### v1

Just use [`React.useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo).

```jsx
import { useState, useMemo } from "react";

function Counter() {
  const [count] = useState(0);
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
  return <Provider initialState={{ counter1: { count: 0 } }}>...</Provider>;
}
```

#### v1

```js
import { useState } from "react";
import createContainer from "constate";

function useCounter({ initialCount = 0 } = {}) {
  const [count, setCount] = useState(initialCount);
  ...
}

const Counter1 = createContainer(useCounter);

function App() {
  return (
    <Counter1.Provider initialCount={10}>
      ...
    </Counter1.Provider>
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
import { useState, useEffect } from "react";
import createContainer from "constate";

const Counter1 = createContainer(useCounter);

function useCounter() {
  const [state, setState] = useState(null);

  useEffect(() => {
    setState(0);
    return () => console.log(state);
  }, []);

  return state;
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
import { useState, useEffect } from "react";
import createContainer from "constate";

const Counter1 = createContainer(useCounter);

function useCounter() {
  const [count, setCount] = useState(0);
  const [calls, setCalls] = useState(0);
  const prevCount = useRef(null);

  useEffect(
    () => {
      // if (type === "increment")
      if (prevCount.current != null && prevCount.current < count) {
        setCalls(prevCalls => prevCalls + 1);
      }
      prevCount.current = count;
    },
    [count] // if (context === "counter1")
  );

  return count;
}
```

### `devtools`

Redux DevTools isn't supported anymore. The React team is working on improvements on React DevTools to debug hooks. See https://github.com/facebook/react-devtools/issues/1215
