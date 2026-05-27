<p align="center">
  <img src="https://raw.githubusercontent.com/diegohaz/constate/main/logo/logo.png" alt="constate logo" width="300" />
</p>

# Constate

<a href="https://npmjs.org/package/constate"><img alt="NPM version" src="https://img.shields.io/npm/v/constate.svg?style=flat-square"></a>
<a href="https://npmjs.org/package/constate"><img alt="NPM downloads" src="https://img.shields.io/npm/dm/constate.svg?style=flat-square"></a>
<a href="https://github.com/diegohaz/constate/actions/workflows/ci.yml"><img alt="CI status" src="https://github.com/diegohaz/constate/actions/workflows/ci.yml/badge.svg?branch=main"></a>

Write local state using [React Hooks](https://reactjs.org/docs/hooks-intro.html) and lift it up to [React Context](https://reactjs.org/docs/context.html) only when needed with minimum effort.

<br>

<table>
  <thead>
    <tr>
      <th colspan="5"><center>📦 Examples 📦</center></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://github.com/diegohaz/constate/blob/main/examples/src/counter/App.tsx">Counter</a></td>
      <td><a href="https://github.com/diegohaz/constate/blob/main/examples/src/i18n/App.tsx">I18n</a></td>
      <td><a href="https://github.com/diegohaz/constate/blob/main/examples/src/theming/App.tsx">Theming</a></td>
      <td><a href="https://github.com/diegohaz/constate/blob/main/examples/src/typescript/App.tsx">TypeScript</a></td>
      <td><a href="https://github.com/diegohaz/constate/blob/main/examples/src/wizard-form/App.tsx">Wizard Form</a></td>
    </tr>
  </tbody>
</table>

<br>

## Basic example

```jsx
import { useState } from "react";
import constate from "constate";

// 1️⃣ Create a custom hook as usual
function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount((prevCount) => prevCount + 1);
  return { count, increment };
}

// 2️⃣ Wrap your hook with the constate factory
const [CounterProvider, useCounterContext] = constate(useCounter);

function Button() {
  // 3️⃣ Use context instead of custom hook
  const { increment } = useCounterContext();
  return <button onClick={increment}>+</button>;
}

function Count() {
  // 4️⃣ Use context in other components
  const { count } = useCounterContext();
  return <span>{count}</span>;
}

function App() {
  // 5️⃣ Wrap your components with Provider
  return (
    <CounterProvider>
      <Count />
      <Button />
    </CounterProvider>
  );
}
```

[Learn more](#api)

## Advanced example

```jsx
import { useCallback, useState } from "react";
import constate from "constate";

// 1️⃣ Create a custom hook that receives props
function useCounter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);
  // 2️⃣ Wrap your updaters with useCallback or use dispatch from useReducer
  const increment = useCallback(() => setCount((prev) => prev + 1), []);
  return { count, increment };
}

// 3️⃣ Wrap your hook with the constate factory splitting the values
const [CounterProvider, useCount, useIncrement] = constate(
  useCounter,
  (value) => value.count, // becomes useCount
  (value) => value.increment, // becomes useIncrement
);

function Button() {
  // 4️⃣ Use the updater context that will never trigger a re-render
  const increment = useIncrement();
  return <button onClick={increment}>+</button>;
}

function Count() {
  // 5️⃣ Use the state context in other components
  const count = useCount();
  return <span>{count}</span>;
}

function App() {
  // 6️⃣ Wrap your components with Provider passing props to your hook
  return (
    <CounterProvider initialCount={10}>
      <Count />
      <Button />
    </CounterProvider>
  );
}
```

[Learn more](#selectors)

## Installation

npm:

```sh
npm i constate
```

Yarn:

```sh
yarn add constate
```

pnpm:

```sh
pnpm add constate
```

## API

### `constate(useValue[, ...selectors])`

Constate exports a single factory method. As parameters, it receives [`useValue`](#usevalue) and optional [`selector`](#selectors) functions. It returns a tuple of `[Provider, ...hooks]`.

#### `useValue`

It's any [custom hook](https://reactjs.org/docs/hooks-custom.html):

```js
import { useState } from "react";
import constate from "constate";

const [CountProvider, useCountContext] = constate(() => {
  const [count] = useState(0);
  return count;
});
```

You can receive props in the custom hook function. They will be populated with `<Provider />`:

```jsx
const [CountProvider, useCountContext] = constate(({ initialCount = 0 }) => {
  const [count] = useState(initialCount);
  return count;
});

function App() {
  return <CountProvider initialCount={10}>...</CountProvider>;
}
```

The API of the containerized hook returns the same value(s) as the original, as long as it is a descendant of the Provider:

```jsx
function Count() {
  const count = useCountContext();
  console.log(count); // 10
}
```

#### `selectors`

Optionally, you can pass in one or more functions to split the custom hook value into multiple React Contexts. This is useful so you can avoid unnecessary re-renders on components that only depend on a part of the state.

A `selector` function receives the value returned by [`useValue`](#usevalue) and returns the value that will be held by that particular Context.

```jsx
import { useCallback, useState } from "react";
import constate from "constate";

function useCounter() {
  const [count, setCount] = useState(0);
  // increment's reference identity will never change
  const increment = useCallback(() => setCount((prev) => prev + 1), []);
  return { count, increment };
}

const [Provider, useCount, useIncrement] = constate(
  useCounter,
  (value) => value.count, // becomes useCount
  (value) => value.increment, // becomes useIncrement
);

function Button() {
  // since increment never changes, this will never trigger a re-render
  const increment = useIncrement();
  return <button onClick={increment}>+</button>;
}

function Count() {
  const count = useCount();
  return <span>{count}</span>;
}
```

## Contributing

If you find a bug, please [create an issue](https://github.com/diegohaz/constate/issues/new) providing instructions to reproduce it. It's always very appreciable if you find the time to fix it. In this case, please [submit a PR](https://github.com/diegohaz/constate/pulls).

If you're a beginner, it'll be a pleasure to help you contribute. You can start by reading [the beginner's guide to contributing to a GitHub project](https://akrabat.com/the-beginners-guide-to-contributing-to-a-github-project/).

When working on this codebase, please use [`pnpm`](https://pnpm.io). Run `pnpm install` once and then `pnpm dev` to start the examples app, or `pnpm test` to run the test suite.

## License

MIT © [Diego Haz](https://github.com/diegohaz)
