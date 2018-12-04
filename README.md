<p align="center">
  <img src="https://raw.githubusercontent.com/diegohaz/constate/master/logo/logo.png" alt="constate logo" width="300" />
</p>

# Constate

<a href="https://npmjs.org/package/constate"><img alt="NPM version" src="https://img.shields.io/npm/v/constate/next.svg?style=flat-square"></a>
<a href="https://npmjs.org/package/constate"><img alt="NPM downloads" src="https://img.shields.io/npm/dm/constate.svg?style=flat-square"></a>
<a href="https://unpkg.com/constate@next"><img alt="Gzip size" src="https://img.badgesize.io/https://unpkg.com/constate@next?style=flat-square&compression=gzip"></a>
<a href="https://david-dm.org/diegohaz/constate"><img alt="Dependencies" src="https://img.shields.io/david/diegohaz/constate/master.svg?style=flat-square"></a>
<a href="https://travis-ci.org/diegohaz/constate"><img alt="Build Status" src="https://img.shields.io/travis/diegohaz/constate/master.svg?style=flat-square"></a>
<a href="https://codecov.io/gh/diegohaz/constate/branch/master"><img alt="Coverage Status" src="https://img.shields.io/codecov/c/github/diegohaz/constate/master.svg?style=flat-square"></a>


~ 1.5 kB React state management library that lets you write contextual state as if it were local state using [React Hooks](https://reactjs.org/docs/hooks-intro.html) and [React Context](https://reactjs.org/docs/context.html).

<br>

<table>
  <thead>
    <tr>
      <th colspan="3">🕹 CodeSandbox demos 🕹</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://codesandbox.io/s/github/diegohaz/constate/tree/master/examples/counter?module=/App.js">Counter</a></td>
      <td><a href="https://codesandbox.io/s/github/diegohaz/constate/tree/master/examples/theming?module=/App.js">Theming</a></td>
      <td><a href="https://codesandbox.io/s/github/diegohaz/constate/tree/master/examples/i18n?module=/App.js">I18n</a></td>
    </tr>
  </tbody>
</table>

<br>

```jsx
import React from "react";
import { Provider, useContextState } from "constate";

// 1. Create a custom hook
function useCounter(key) {
  // 2. Replace React.useState(0) by useContextState(key, 0)
  const [count, setCount] = useContextState(key, 0);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

function Count() {
  // 3. Consume the custom hook as usual
  const { count } = useCounter("counter1");
  return <span>{count}</span>
}

function IncrementButton() {
  // 4. Consume the same key in other components
  const { increment } = useCounter("counter1");
  return <button onClick={increment}>+</button>;
}

function App() {
  // 5. Wrap your app with Provider
  return (
    <Provider>
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
- [`useContextKey`](#usecontextkey)
- [`useContextEffect`](#usecontexteffect)
- [`createContext`](#createcontext)

<br>

## Installation

npm:
```sh
npm i constate@next
```

Yarn:
```sh
yarn add constate@next
```

> You'll need to install `react@next` and `react-dom@next`

> Constate `v1` is currently in early alpha. If you're looking for `v0`, see [`v0` docs](https://github.com/diegohaz/constate/tree/v0#readme) or read the [migration guide](MIGRATING_FROM_V0_TO_V1.md).

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

`useContextState` has the same API as [`React.useState`](https://reactjs.org/docs/hooks-reference.html#usestate), except that it receives `contextKey` as the first argument. It can be either a string or the return value of [`useContextKey`](#usecontextkey).

All `useContextState` calls with the same `contextKey` throughout components in the [`Provider`](#provider) tree will share the same state.

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

function useCounter(key) {
  const [count, setCount] = useContextState(key, 0);
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

Just like [`useContextState`](#usecontextstate), `useContextReducer` works similarly to [`React.useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer), but accepting a `contextKey` argument, which can be either a string or the return value of [`useContextKey`](#usecontextkey):

```jsx
import { useContextReducer } from "constate";

function reducer(state, action) {
  switch(action.type) {
    case "INCREMENT": return state + 1;
    case "DECREMENT": return state - 1;
    default: return state;
  }
}

function useCounter(key) {
  const [count, dispatch] = useContextReducer(key, reducer, 0);
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

## `useContextKey`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

Instead of passing strings to [`useContextState`](#usecontextstate) and [`useContextReducer`](#usecontextreducer), you can create a reference to the context key.

```js
import { useContextKey } from "constate";

function Counter() {
  const key = useContextKey("counter1");
  const [count, setCount] = useContextState(key, 0);
  ...
}
```

It uses [`React.useRef`](https://reactjs.org/docs/hooks-reference.html#useref) underneath and is required when using [`useContextEffect`](#usecontexteffect).

<br>

## `useContextEffect`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

Constate provides all contextual versions of [`React.useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect), such as `useContextEffect` and `useContextLayoutEffect`. 

They receive `contextKey` as the first argument. Unlike [`useContextState`](#usecontextstate) and [`useContextReducer`](#usecontextreducer), it's limited to the value returned by [`useContextKey`](#usecontextkey). If `contextKey` is `null` or `undefined`, the hook will work exactly as the React one.

```jsx
import { Provider, useContextKey, useContextEffect } from "constate";

let count = 0;

function useCounter(context) {
  // useContextKey is required for effects
  const key = useContextKey(context);
  useContextEffect(key, () => {
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
  useContextKey,
  useContextState,
  useContextReducer,
  useContextEffect,
  useContextLayoutEffect
} = createContext({
  counter1: 0,
  posts: [
    { id: 1, title: "Hello World!" }
  ]
});

export {
  Provider,
  useContextKey,
  useContextState,
  useContextReducer,
  useContextEffect,
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

<br>

## Contributing

If you find a bug, please [create an issue](https://github.com/diegohaz/constate/issues/new) providing instructions to reproduce it. It's always very appreciable if you find the time to fix it. In this case, please [submit a PR](https://github.com/diegohaz/constate/pulls).

If you're a beginner, it'll be a pleasure to help you contribute. You can start by reading [the beginner's guide to contributing to a GitHub project](https://akrabat.com/the-beginners-guide-to-contributing-to-a-github-project/).

When working on this codebase, please use `yarn`. Run `yarn examples:start` to run examples.

<br>

## License

MIT © [Diego Haz](https://github.com/diegohaz)
