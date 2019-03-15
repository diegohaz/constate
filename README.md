<p align="center">
  <img src="https://raw.githubusercontent.com/diegohaz/constate/master/logo/logo.png" alt="constate logo" width="300" />
</p>

# Constate

<a href="https://npmjs.org/package/constate"><img alt="NPM version" src="https://img.shields.io/npm/v/constate.svg?style=flat-square"></a>
<a href="https://npmjs.org/package/constate"><img alt="NPM downloads" src="https://img.shields.io/npm/dm/constate.svg?style=flat-square"></a>
<a href="https://unpkg.com/constate"><img alt="Size" src="https://img.badgesize.io/https://unpkg.com/constate?style=flat-square"></a>
<a href="https://david-dm.org/diegohaz/constate"><img alt="Dependencies" src="https://img.shields.io/david/diegohaz/constate.svg?style=flat-square"></a>
<a href="https://travis-ci.org/diegohaz/constate"><img alt="Build Status" src="https://img.shields.io/travis/diegohaz/constate/master.svg?style=flat-square"></a>
<a href="https://codecov.io/gh/diegohaz/constate/branch/master"><img alt="Coverage Status" src="https://img.shields.io/codecov/c/github/diegohaz/constate/master.svg?style=flat-square"></a>

Write local state using [React Hooks](https://reactjs.org/docs/hooks-intro.html) and lift it up to [React Context](https://reactjs.org/docs/context.html) only when needed with minimum effort.

<br>

<table>
  <thead>
    <tr>
      <th colspan="5"><center>🕹 CodeSandbox demos 🕹</center></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://codesandbox.io/s/github/diegohaz/constate/tree/master/examples/counter?module=/App.js">Counter</a></td>
      <td><a href="https://codesandbox.io/s/github/diegohaz/constate/tree/master/examples/i18n?module=/App.js">I18n</a></td>
      <td><a href="https://codesandbox.io/s/github/diegohaz/constate/tree/master/examples/theming?module=/App.js">Theming</a></td>
      <td><a href="https://codesandbox.io/s/github/diegohaz/constate/tree/master/examples/typescript?module=/App.tsx">TypeScript</a></td>
      <td><a href="https://codesandbox.io/s/github/diegohaz/constate/tree/master/examples/wizard-form?module=/App.js">Wizard Form</a></td>
    </tr>
  </tbody>
</table>

<br>

```jsx
import React, { useState, useContext } from "react";
import createContainer from "constate";

// 1️⃣ Create a custom hook as usual
function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

// 2️⃣ Create container
const CounterContainer = createContainer(useCounter);

function Button() {
  // 3️⃣ Use container context instead of custom hook
  // const { increment } = useCounter();
  const { increment } = useContext(CounterContainer.Context);
  return <button onClick={increment}>+</button>;
}

function Count() {
  // 4️⃣ Use container context in other components
  // const { count } = useCounter();
  const { count } = useContext(CounterContainer.Context);
  return <span>{count}</span>;
}

function App() {
  // 5️⃣ Wrap your components with container provider
  return (
    <CounterContainer.Provider>
      <Count />
      <Button />
    </CounterContainer.Provider>
  );
}
```

## Installation

npm:

```sh
npm i constate
```

Yarn:

```sh
yarn add constate
```

## API

### `createContainer(useValue[, createMemoInputs])`

Constate exports a single method called `createContainer`. It receives two arguments: [`useValue`](#usevalue) and [`createMemoInputs`](#creatememoinputs) (optional). And returns `{ Context, Provider }`.

#### `useValue`

It's a [custom hook](https://reactjs.org/docs/hooks-custom.html) that returns the Context value:

```js
import React, { useState } from "react";
import createContainer from "constate";

const CounterContainer = createContainer(() => {
  const [count] = useState(0);
  return count;
});

console.log(CounterContainer); // { Context, Provider }
```

You can receive arguments in the custom hook function. They will be populated with `<Provider />`:

```jsx
const CounterContainer = createContainer(({ initialCount = 0 }) => {
  const [count] = useState(initialCount);
  return count;
});

function App() {
  return (
    <CounterContainer.Provider initialCount={10}>
      ...
    </CounterContainer.Provider>
  );
}
```

The value returned in `useValue` will be accessible when using `useContext(CounterContainer.Context)`:

```jsx
import React, { useContext } from "react";

function Counter() {
  const count = useContext(CounterContainer.Context);
  console.log(count); // 10
}
```

#### `createMemoInputs`

Optionally, you can pass in a function that receives the `value` returned by `useValue` and returns an array of inputs. When any input changes, `value` gets re-evaluated, triggering a re-render on all consumers (components calling `useContext()`).

If `createMemoInputs` is undefined, it'll be re-evaluated everytime `Provider` renders:

```js
// re-render consumers only when value.count changes
const CounterContainer = createContainer(useCounter, value => [value.count]);

function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  return { count, increment };
}
```

This works similarly to the `inputs` parameter in [`React.useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) and other React built-in hooks. In fact, Constate passes it to [`React.useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo) `inputs` internally.

You can also achieve the same behavior within the custom hook. This is an equivalent implementation:

```js
import { useMemo } from "react";

const CounterContainer = createContainer(() => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  // same as passing `value => [value.count]` to `createMemoInputs` parameter
  return useMemo(() => ({ count, increment }), [count]);
});
```

## Contributing

If you find a bug, please [create an issue](https://github.com/diegohaz/constate/issues/new) providing instructions to reproduce it. It's always very appreciable if you find the time to fix it. In this case, please [submit a PR](https://github.com/diegohaz/constate/pulls).

If you're a beginner, it'll be a pleasure to help you contribute. You can start by reading [the beginner's guide to contributing to a GitHub project](https://akrabat.com/the-beginners-guide-to-contributing-to-a-github-project/).

When working on this codebase, please use `yarn`. Run `yarn examples:start` to run examples.

## License

MIT © [Diego Haz](https://github.com/diegohaz)
