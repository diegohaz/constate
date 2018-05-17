<p align="center">
  <img src="logo/logo.svg" alt="constate logo" width="300" />
</p>
<br /><br />

<p align="center">
  <a href="https://github.com/diegohaz/nod"><img alt="Generated with nod" src="https://img.shields.io/badge/generator-nod-2196F3.svg?style=flat-square" /></a>
  <a href="https://npmjs.org/package/constate"><img alt="NPM version" src="https://img.shields.io/npm/v/constate.svg?style=flat-square" /></a>
  <a href="https://unpkg.com/constate"><img alt="Gzip size" src="https://img.badgesize.io/https://unpkg.com/constate?style=flat-square&compression=gzip" /></a>
  <a href="https://travis-ci.org/diegohaz/constate"><img alt="Build Status" src="https://img.shields.io/travis/diegohaz/constate/master.svg?style=flat-square" /></a>
  <a href="https://codecov.io/gh/diegohaz/constate/branch/master"><img alt="Coverage Status" src="https://img.shields.io/codecov/c/github/diegohaz/constate/master.svg?style=flat-square" /></a>
</p>
<br /><br />

> context + state = constate

Tiny React state management library that lets you work with [local state](#actions) and scale up to [global state](#context) with ease when needed.

👓 [**Read the introductory article**](https://medium.freecodecamp.org/reacts-new-context-api-how-to-toggle-between-local-and-global-state-c6ace81443d0)<br>
🎮 [**Play with the demo**](https://codesandbox.io/s/7p2qv6mmq)

<br><br>

```jsx
import React from "react";
import { Container } from "constate";

const initialState = { count: 0 };

const actions = {
  increment: () => state => ({ count: state.count + 1 })
};

const Counter = () => (
  <Container initialState={initialState} actions={actions}>
    {({ count, increment }) => (
      <button onClick={increment}>{count}</button>
    )}
  </Container>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/39095434-ba7c42c2-4616-11e8-9836-f46ea572c170.gif" alt="Example"></p>

**Table of Contents**

- [Installation](#installation)
- [`Container`](#container)
  - [`initialState`](#initialstate)
  - [`actions`](#actions)
  - [`selectors`](#selectors)
  - [`effects`](#effects)
  - [`context`](#context)
  - [`onMount`](#onMount)
  - [`onUpdate`](#onUpdate)
  - [`onUnmount`](#onUnmount)
- [`Provider`](#provider)
  - [`initialState`](#initialstate-1)
- [Composing](#composing)
- [Testing](#testing)

## Installation

```sh
npm i constate
```

## `Container`

> In computer science, a **container** is a class, a data structure, or an abstract data type (ADT) whose instances are collections of other objects. In other words, they store objects in an organized way that follows specific access rules.
>
> — <https://en.wikipedia.org/wiki/Container_(abstract_data_type)>

### `initialState`

```js
type initialState = Object;
```

Use this prop to define the initial state of the container.

```jsx
const initialState = { count: 0 };

const Counter = () => (
  <Container initialState={initialState}>
    {({ count }) => <button>{count}</button>}
  </Container>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/40029572-206945be-579a-11e8-95ad-4613adf73da4.png" width="55" alt="Example"></p>

### `actions`

```js
type Actions = {
  [string]: () => (state: Object) => Object
};
```

An action is a method that returns an `updater` function, which will be, internally, passed as an argument to React `setState`. Actions will be exposed, then, together with state within the child function.

```jsx
const initialState = { count: 0 };

const actions = {
  increment: amount => state => ({ state.count + amount })
};

const Counter = () => (
  <Container initialState={initialState} actions={actions}>
    {({ count, increment }) => (
      <button onClick={() => increment(1)}>{count}</button>
    )}
  </Container>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/39095434-ba7c42c2-4616-11e8-9836-f46ea572c170.gif" alt="Example"></p>

### `selectors`

```js
type Selectors = {
  [string]: () => (state: Object) => any
};
```

A selector is a method that returns a function, which receives the current state and should return something (the thing being selected).

```jsx
const initialState = { count: 0 };

const actions = {
  increment: amount => state => ({ state.count + amount })
};

const selectors = {
  getParity: () => state => (state.count % 2 === 0 ? "even" : "odd")
};

const Counter = () => (
  <Container
    initialState={initialState}
    actions={actions}
    selectors={selectors}
  >
    {({ count, increment, getParity }) => (
      <button onClick={() => increment(1)}>{count} {getParity()}</button>
    )}
  </Container>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/39095320-f1595764-4614-11e8-98e3-343042cef61c.gif" alt="Example"></p>

### `effects`

```js
type Effects = {
  [string]: () => ({ state: Object, setState: Function }) => void
};
```

An effect is a method that returns a function, which receives both `state` and `setState`. This is useful if you need to perform side effects, like async actions, or just want to use `setState`.

```jsx
const initialState = { count: 0 };

const effects = {
  tick: () => ({ setState }) => {
    const fn = () => setState(state => ({ count: state.count + 1 }));
    setInterval(fn, 1000);
  }
};

const Counter = () => (
  <Container initialState={initialState} effects={effects}>
    {({ count, tick }) => (
      <button onClick={tick}>{count}</button>
    )}
  </Container>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/39095395-46d82eb2-4616-11e8-9e15-e5bb5041b4a8.gif" alt="Example"></p>

### `context`

```js
type Context = string;
```

Whenever you need to share state between components and/or feel the need to have a global state, you can pass a `context` prop to `Container` and wrap your app with `Provider`.

```jsx
import { Provider, Container } from "constate";

const CounterContainer = props => (
  <Container
    initialState={{ count: 0 }}
    actions={{ increment: () => state => ({ count: state.count + 1 }) }}
    {...props}
  />
);

const CounterButton = () => (
  <CounterContainer context="counter1">
    {({ increment }) => <button onClick={increment}>Increment</button>}
  </CounterContainer>
);

const CounterValue = () => (
  <CounterContainer context="counter1">
    {({ count }) => <div>{count}</div>}
  </CounterContainer>
);

const App = () => (
  <Provider>
    <CounterButton />
    <CounterValue />
  </Provider>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/39095299-b176af2a-4614-11e8-99ce-4980bdf2f139.gif" alt="Example"></p>

### `onMount`

```js
type OnMount = ({ state: Object, setState: Function }) => void;
```

This is a function called inside `Container`'s `componentDidMount`.

> Note: when using [`context`](#context), all `Container`s of the same context behave as a single unit, which means that `onMount` will be called only for the first mounted `Container` of each context.

```jsx
const initialState = { count: 0 };

const onMount = ({ setState }) => {
  const fn = () => setState(state => ({ count: state.count + 1 }));
  document.body.addEventListener("mousemove", fn);
};

const Counter = () => (
  <Container initialState={initialState} onMount={onMount}>
    {({ count }) => <button>{count}</button>}
  </Container>
);
```

### `onUpdate`

```js
type OnUpdate = ({ prevState: Object, state: Object, setState: Function }) => void;
```

This is a function called every time `setState` is called, either internally with [`actions`](#actions) or directly with [`effects`](#effects) and lifecycle methods, including `onUpdate` itself.

> Note: when using [`context`](#context), `onUpdate` will be triggered only once per `setState` call no matter how many `Container`s of the same context you have mounted.

```jsx
const initialState = { count: 0 };

const onMount = ({ setState }) => {
  const fn = () => setState(state => ({ count: state.count + 1 }));
  setInterval(fn, 1000);
};

const onUpdate = ({ state, setState }) => {
  if (state.count === 5) {
    // reset counter
    setState({ count: 0 });
  }
};

const Counter = () => (
  <Container initialState={initialState} onMount={onMount} onUpdate={onUpdate}>
    {({ count }) => <button>{count}</button>}
  </Container>
);
```

### `onUnmount`

```js
type OnUnmount = ({ state: Object, setState: Function }) => void;
```

This is a function called inside `Container`'s `componentWillUnmount`. It receives both current `state` and `setState`, but the latter will have effect only if you're using [`context`](#context). Otherwise, it will be noop. This is useful for making cleanups. 

> Note: when using [`context`](#context), all `Container`s of the same context behave as a single unit, which means that `onUnmount` will be called only when the last remaining `Container` of each context gets unmounted.

```jsx
const initialState = { count: 0 };

const onMount = ({ setState }) => {
  const fn = () => setState(state => ({ count: state.count + 1 }));
  const interval = setInterval(fn, 1000);
  setState({ interval });
};

const onUnmount = ({ state }) => {
  clearInterval(state.interval);
};

const Counter = () => (
  <Container initialState={initialState} onMount={onMount} onUnmount={onUnmout}>
    {({ count }) => <button>{count}</button>}
  </Container>
);
```

## `Provider`

### `initialState`

It's possible to pass initialState to Provider:

```jsx
const initialState = {
  counter1: {
    count: 10
  }
};

const App = () => (
  <Provider initialState={initialState}>
    ...
  </Provider>
);
```

This way, all `Container`s with `context="counter1"` will start with `{ count: 10 }`.

> Note: when using [`context`](#context), only the `initialState` of the first `Container` in the tree will be considered. `Provider` will always take precedence over `Container`.

## Composing

Since `Container` is just a React component, you can create `Container`s that accepts new properties, making them really composable. 

For example, let's create a composable `CounterContainer`:

```jsx
const increment = () => state => ({ count: state.count + 1 });

const CounterContainer = ({ initialState, actions, ...props }) => (
  <Container
    initialState={{ count: 0, ...initialState }}
    actions={{ increment, ...actions }}
    {...props}
  />
);
```

Then, we can use it to create a `DecrementableCounterContainer`:

```jsx
const decrement = () => state => ({ count: state.count - 1 });

const DecrementableCounterContainer = ({ actions, ...props }) => (
  <CounterContainer actions={{ decrement, ...actions }} {...props} />
);
```

Finally, we can use it on our other components:

```jsx
const CounterButton = () => (
  <DecrementableCounterContainer initialState={{ count: 10 }}>
    {({ count, decrement }) => <button onClick={decrement}>{count}</button>}
  </DecrementableCounterContainer>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/39095340-51373818-4615-11e8-9b76-dd883e9065fb.gif" alt="Example"></p>

## Testing

[`actions`](#actions) and [`selectors`](#selectors) are pure functions. Testing is pretty straightfoward:

```js
import { initialState, actions, selectors } from "./CounterContainer";

test("initialState", () => {
  expect(initialState).toEqual({ count: 0 });
});

test("actions", () => {
  expect(actions.increment(1)({ count: 0 })).toEqual({ count: 1 });
  expect(actions.increment(-1)({ count: 1 })).toEqual({ count: 0 });
});

test("selectors", () => {
  expect(selectors.getParity()({ count: 0 })).toBe("even");
  expect(selectors.getParity()({ count: 1 })).toBe("odd");
});
```

Testing [`effects`](#effects) and lifecycle methods can be a little tricky depending on how you implement them. This is how we can test our `tick` effect with [Jest](https://facebook.github.io/jest):

```jsx
import { effects } from "./CounterContainer";

test("tick", () => {
  jest.useFakeTimers();

  let state = { count: 0 };
  const setState = fn => {
    state = fn(state);
  };

  effects.tick()({ state, setState });

  jest.advanceTimersByTime(1000);
  expect(state).toEqual({ count: 1 });

  jest.advanceTimersByTime(1000);
  expect(state).toEqual({ count: 2 });
});
```

## Contributing

If you find a bug, please [create an issue](https://github.com/diegohaz/constate/issues/new) providing instructions to reproduce it. It's always very appreciable if you find the time to fix it. In this case, please [submit a PR](https://github.com/diegohaz/constate/pulls).

If you're a beginner, it'll be a pleasure to help you contribute. You can start by reading [the beginner's guide to contributing to a GitHub project](https://akrabat.com/the-beginners-guide-to-contributing-to-a-github-project/).

## TODO

-   Middlewares? ([create an issue](https://github.com/diegohaz/constate/issues/new) if you find a use case for this)
-   Debugger/devtools
-   Memoize selectors

## License

MIT © [Diego Haz](https://github.com/diegohaz)
