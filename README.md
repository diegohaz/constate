<p align="center">
  <img src="https://raw.githubusercontent.com/diegohaz/constate/master/logo/logo.png" alt="constate logo" width="300" />
</p>
<br>

<p align="center">
  1 kB React state management library that lets you write contextual state<br>
  as if it were local state, using <a href="https://reactjs.org/docs/hooks-intro.html">React Hooks</a>.
</p>

<br>

<p align="center">
  <a href="https://npmjs.org/package/constate"><img alt="NPM version" src="https://img.shields.io/npm/v/constate.svg?style=flat-square"></a>
  <a href="https://unpkg.com/constate"><img alt="Gzip size" src="https://img.badgesize.io/https://unpkg.com/constate?style=flat-square&compression=gzip"></a>
  <a href="https://david-dm.org/diegohaz/constate"><img alt="Dependencies" src="https://img.shields.io/david/diegohaz/constate/master.svg?style=flat-square"></a>
  <a href="https://travis-ci.org/diegohaz/constate"><img alt="Build Status" src="https://img.shields.io/travis/diegohaz/constate/master.svg?style=flat-square"></a>
  <a href="https://codecov.io/gh/diegohaz/constate/branch/master"><img alt="Coverage Status" src="https://img.shields.io/codecov/c/github/diegohaz/constate/master.svg?style=flat-square"></a>
</p>

<br>

<p align="center">
  <strong>🎮 Play with CodeSandbox examples</strong>
  <br>
  <a href="https://codesandbox.io/s/github/diegohaz/constate/tree/master/examples/counter">Counter</a>
</p>

<br>

```jsx
import React from "react";
import { Provider, useContextState } from "constate";

function DecrementButton() {
  // const [count, setCount] = React.useState(0);
  const [count, setCount] = useContextState("counter1", 0);
  const decrement = () => setCount(count - 1)
  return <button onClick={decrement}>-</button>;
}

function IncrementButton() {
  // const [count, setCount] = React.useState(0);
  const [count, setCount] = useContextState("counter1", 0);
  const increment = () => setCount(count + 1)
  return <button onClick={increment}>+</button>;
}

function Count() {
  // const [count] = React.useState(0);
  const [count] = useContextState("counter1", 0);
  return <span>{count}</span>
}

function App() {
  return (
    <Provider>
      <DecrementButton />
      <Count />
      <IncrementButton />
    </Provider>
  );
}
```

<br>

#### Table of Contents

- [Installation](#installation)
- [`Provider`](#provider)
- [`useContextState`](#usecontextstate)
- [`useContextReducer`](#usecontextreducer)
- [`useContextEffect`](#usecontexteffect)
- [`createContext`](#createcontext)

<br>

## Installation

```sh
npm i constate@next
```

<br>

## `Provider`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

First, you should wrap your app (or the part using Constate) with `Provider` so as to access contextual state within hooks:

```jsx
import React from "react";
import { Provider } from "constate";

function App() {
  return (
    <Provider devtools={process.env.NODE_ENV === "development"}>
      ...
    </Provider>
  );
}
```

Passing `devtools` prop to `Provider` will enable the [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) integration, if that's installed in your browser. With that, you can easily debug the state of your application.

<p align="center">
  <img src="https://user-images.githubusercontent.com/3068563/48814011-62601300-ed20-11e8-896b-c5c7a080989e.png" alt="Using Redux Devtools Extension" width="800">
</p>

<br>

## `useContextState`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

`useContextState` has the same API as [`React.useState`](https://reactjs.org/docs/hooks-reference.html#usestate), except that it receives `contextKey` as the first argument.

```jsx
import { useContextState } from "constate";

function Component() {
  // accesses state.contextKey in context
  const [state, setState] = useContextState("contextKey", "initialValue");
  ...
}
```

If you pass `null` or `undefined` into the `contextKey` parameter, it'll work exactly like [`React.useState`](https://reactjs.org/docs/hooks-reference.html#usestate):

```jsx
import { useContextState } from "constate";

function Component() {
  // same as React.useState("initialValue")
  const [state, setState] = useContextState(null, "initialValue");
  ...
}
```

This means you can create [custom hooks](https://reactjs.org/docs/hooks-custom.html) that can be either contextual or local depending on the component using it:

```jsx
import React from "react";
import { useContextState } from "constate";

function useCounter(context) {
  const [count, setCount] = useContextState(context, 0);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

function ContextualCounter() {
  const { count, increment } = useCounter("counter1");
  return <button onClick={increment}>{count}</button>;
}

function LocalCounter() {
  const { count, increment } = useCounter();
  return <button onClick={increment}>{count}</button>;
}
```

<br>

## `useContextReducer`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

Just like [`useContextState`](#usecontextstate), `useContextReducer` works similarly to [`React.useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer), but accepting a `contextKey` argument:

```jsx
import { useContextReducer } from "constate";

function reducer(state, action) {
  switch(action.type) {
    case "INCREMENT": return state + 1;
    case "DECREMENT": return state - 1;
    default: return state;
  }
}

function useCounter(context) {
  const [count, dispatch] = useContextReducer(context, reducer, 0);
  const increment = () => dispatch({ type: "INCREMENT" });
  const decrement = () => dispatch({ type: "DECREMENT" });
  return { count, increment, decrement };
}

function ContextualCounter() {
  const { count, increment } = useCounter("counter1");
  return <button onClick={increment}>{count}</button>;
}
```

<br>

## `useContextEffect`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

Constate provides all contextual versions of [`React.useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect), such as `useContextEffect`, `useContextMutationEffect` and `useContextLayoutEffect`. 

They receive `contextKey` as the first argument. If `contextKey` is `null` or `undefined`, the hook will work exactly as the React one.

```js
import { Provider, useContextEffect } from "constate";

let count = 0;

function useCounter(context) {
  useContextEffect(context, () => {
    count += 1;
  }, []);
}

function ContextualCounter1() {
  useCounter("counter1");
  ...
}

function ContextualCounter2() {
  useCounter("counter1");
  ...
}

function App() {
  return (
    <Provider>
      <ContextualCounter1 />
      <ContextualCounter2 />
    </Provider>
  );
}
```

In the example above, if we were using [`React.useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect), `count` would be `2`. With `useContextEffect`, it's `1`.

`useContextEffect` ensures that the function will be called only once per `contextKey` no matter how many components are using it.

<br>

## `createContext`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

If you want to set a initial state for the whole context tree and/or want to create separate contexts, you can use `createContext`:

```js
// MyContext.js
import { createContext } from "constate";

const {
  Provider,
  useContextState,
  useContextReducer,
  useContextEffect,
  useContextMutationEffect,
  useContextLayoutEffect
} = createContext({
  counter1: 0,
  posts: [
    { id: 1, title: "Hello World!" }
  ]
});

export {
  Provider,
  useContextState,
  useContextReducer,
  useContextEffect,
  useContextMutationEffect,
  useContextLayoutEffect
};
```

```jsx
// App.js
import React from "react";
import { Provider, useContextState } from "./MyContext";

function Counter() {
  // no need for initial value, it has been set in context
  const [count, setCount] = useContextState("counter1");
  const increment = () => setCount(count + 1);
  return <button onClick={increment}>{count}</button>;
}

function App() {
  return (
    <Provider>
      <Counter />
    </Provider>
  );
}
```

> When importing hooks directly from the `constate` package, you're, in fact, using a default context created by our [index file](src/index.ts).

`createContext` receives a second argument `name`, which will be displayed in the Redux Devtools when using the `devtools` prop on `Provider`.

<br>

## Contributing

If you find a bug, please [create an issue](https://github.com/diegohaz/constate/issues/new) providing instructions to reproduce it. It's always very appreciable if you find the time to fix it. In this case, please [submit a PR](https://github.com/diegohaz/constate/pulls).

If you're a beginner, it'll be a pleasure to help you contribute. You can start by reading [the beginner's guide to contributing to a GitHub project](https://akrabat.com/the-beginners-guide-to-contributing-to-a-github-project/).

When working on this codebase, please use `yarn`. Run `yarn examples:start` to run examples.

<br>

## License

MIT © [Diego Haz](https://github.com/diegohaz)
