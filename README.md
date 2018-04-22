<p align="center">
  <img src="logo/logo.svg" alt="constate logo" width="300" />
</p>
<br /><br />

<p align="center">
  <a href="https://github.com/diegohaz/nod"><img alt="Generated with nod" src="https://img.shields.io/badge/generator-nod-2196F3.svg?style=flat-square" /></a>
  <a href="https://npmjs.org/package/constate"><img alt="NPM version" src="https://img.shields.io/npm/v/constate.svg?style=flat-square" /></a>
  <a href="https://travis-ci.org/diegohaz/constate"><img alt="Build Status" src="https://img.shields.io/travis/diegohaz/constate/master.svg?style=flat-square" /></a>
  <a href="https://codecov.io/gh/diegohaz/constate/branch/master"><img alt="Coverage Status" src="https://img.shields.io/codecov/c/github/diegohaz/constate/master.svg?style=flat-square" /></a>
</p>
<br /><br />

> context + state = constate

~2kB React state management library that lets you work with [local state](#local-state) and scale up to [global state](#global-state) with ease when needed.

👓 [**Read the introductory article**](https://medium.freecodecamp.org/reacts-new-context-api-how-to-toggle-between-local-and-global-state-c6ace81443d0)<br>
🎮 [**Play with the demo**](https://codesandbox.io/s/7p2qv6mmq)

<br>
<hr>
<p align="center">
If you find this useful, please don't forget to star ⭐️ the repo, as this will help to promote the project.<br>
Follow me on <a href="https://twitter.com/diegohaz">Twitter</a> and <a href="https://github.com/diegohaz">GitHub</a> to keep updated about this project and <a href="https://github.com/diegohaz?tab=repositories">others</a>.
</p>
<hr>
<br>

## Install 📦

```sh
npm i constate
```

## Quick start 💥

```jsx
import React from "react";
import { State } from "constate";

const initialState = { count: 0 };

const actions = {
  increment: () => state => ({ count: state.count + 1 })
};

const Counter = () => (
  <State initialState={initialState} actions={actions}>
    {({ count, increment }) => (
      <button onClick={increment}>{count}</button>
    )}
  </State>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/39095434-ba7c42c2-4616-11e8-9836-f46ea572c170.gif" alt="Example"></p>

## Guide 📖

**Table of Contents**

-   [Local state](#local-state)
-   [Global state](#global-state)
-   [Composing state](#composing-state)
-   [Effects](#effects)
-   [Global initial state](#global-initial-state)
-   [State in lifecycle methods](#state-in-lifecycle-methods)
-   [Call selectors in actions](#call-selectors-in-actions)
-   [Call actions in effects](#call-actions-in-effects)
-   [Testing](#testing)

### Local state

You can start by creating your `State` component:

```jsx
import React from "react";
import { State } from "constate";

export const initialState = {
  count: 0
};

export const actions = {
  increment: amount => state => ({ count: state.count + amount })
};

export const selectors = {
  getParity: () => state => (state.count % 2 === 0 ? "even" : "odd")
};

const CounterState = props => (
  <State
    initialState={initialState}
    actions={actions}
    selectors={selectors}
    {...props}
  />
);

export default CounterState;
```

> Note: the reason we're exporting `initialState`, `actions` and `selectors` is to make [testing](#testing) easier.

Then, just use it elsewhere:

```jsx
const CounterButton = () => (
  <CounterState>
    {({ count, increment, getParity }) => (
      <button onClick={() => increment(1)}>{count} {getParity()}</button>
    )}
  </CounterState>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/39095320-f1595764-4614-11e8-98e3-343042cef61c.gif" alt="Example"></p>

### Global state

Whenever you need to share state between components and/or feel the need to have a global state, you can pass a `context` property to `State` and wrap your app with `Provider`:

```jsx
const CounterButton = () => (
  <CounterState context="counter1">
    {({ increment }) => <button onClick={() => increment(1)}>Increment</button>}
  </CounterState>
);

const CounterValue = () => (
  <CounterState context="counter1">
    {({ count }) => <div>{count}</div>} 
  </CounterState>
);

const App = () => (
  <Provider>
    <CounterButton />
    <CounterValue />
  </Provider>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/39095299-b176af2a-4614-11e8-99ce-4980bdf2f139.gif" alt="Example"></p>

### Composing state

This is still React, so you can pass new properties to `CounterState`, making it really composable.

First, let's change our `CounterState` so as to receive new properties:

```jsx
const CounterState = props => (
  <State
    {...props}
    initialState={{ ...initialState, ...props.initialState }}
    actions={{ ...actions, ...props.actions }}
    selectors={{ ...selectors, ...props.selectors }}
  />
);
```

Now we can pass new `initialState`, `actions` and `selectors` to `CounterState`:

```jsx
export const initialState = {
  count: 10
};

export const actions = {
  decrement: amount => state => ({ count: state.count - amount })
};

const CounterButton = () => (
  <CounterState initialState={initialState} actions={actions}>
    {({ count, decrement }) => (
      <button onClick={() => decrement(1)}>{count}</button>
    )}
  </CounterState>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/39095340-51373818-4615-11e8-9b76-dd883e9065fb.gif" alt="Example"></p>

Those new members will work even if you use `context`.


### Effects

An effect is a method that receives both `state` and `setState`. This is useful if you need to perform side effects, like `async` actions, or just want to use `setState`.

```jsx
export const effects = {
  tick: () => ({ setState }) => {
    setTimeout(() => {
      setState(state => ({ count: state.count + 1 }));
      effects.tick()({ setState })
    }, 1000);
  }
};

const AutomaticCounterButton = () => (
  <CounterState effects={effects}>
    {({ count, tick }) => (
      <button onClick={tick}>{count}</button>
    )}
  </CounterState>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/39095395-46d82eb2-4616-11e8-9e15-e5bb5041b4a8.gif" alt="Example"></p>

### Global initial state

It's possible to pass `initialState` to `Provider`:

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

This way, all `State` with `context="counter1"` will start with `{ count: 10 }`

> Note: while using context, only the `initialState` of the first `State` in the tree will be considered. `Provider` will always take precedence over `State`.

### State in lifecycle methods

As stated in the [official docs](https://reactjs.org/docs/context.html#accessing-context-in-lifecycle-methods), to access state in lifecycle methods you can just pass the state down as a prop to another component and use it just like another prop:

```jsx
class CounterButton extends React.Component {
  componentDidMount() {
    this.props.state.increment(1);
  }

  render() {
    const { increment } = this.props.state;
    return <button onClick={() => increment(1)}>Increment</button>;
  }
}

export default props => (
  <CounterState context="counter1">
    {state => <CounterButton {...props} state={state} />}
  </CounterState>
);
```

Another alternative is to use <https://github.com/reactions/component>:

```jsx
import Component from "@reactions/component";

const CounterButton = () => (
  <CounterState context="counter1">
    {({ increment }) => (
      <Component didMount={() => increment(1)}>
        <button onClick={() => increment(1)}>Increment</button>
      </Component>
    )}
  </CounterState>
);
```

### Call selectors in actions

This is just JavaScript:

```jsx
export const selectors = {
  isEven: () => state => state.count % 2 === 0
};

export const actions = {
  increment: () => state => ({
    count: state.count + (selectors.isEven()(state) ? 2 : 1)
  })
};
```

### Call actions in effects

Aren't you already convinced that this is JavaScript?

```jsx
const increment = amount => state => ({ count: state.count + amount })

export const effects = {
  tick: amount => ({ setState }) => {
    setTimeout(() => {
      setState(increment(amount));
      effects.tick(amount)({ setState })
    }, 1000);
  }
};
```

### Testing

`actions` and `selectors` are pure functions. Testing is pretty straightfoward:

```js
import { initialState, actions, selectors } from "./CounterState";

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

Testing `effects` can be a little tricky depending on how you implement them. This is how we can test our `tick` effect with [Jest](https://facebook.github.io/jest):

```jsx
import { effects } from "./CounterState";

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

## API 🧐

```js
type Action = () => (state: Object) => Object;

type Selector = () => (state: Object) => any;

type Effect = () => ({ state: Object, setState: Function }) => void;

type StateProps = {
  children: (state: Object) => React.Node,
  initialState: Object,
  actions: { [string]: Action },
  selectors: { [string]: Selector },
  effects: { [string]: Effect },
  context: string
};

type ProviderProps = {
  children: React.Node,
  initialState: Object
};
```

## Contributing 👥

If you find a bug, please [create an issue](https://github.com/diegohaz/constate/issues/new) providing instructions to reproduce it. It's always very appreciable if you find the time to fix it. In this case, please [submit a PR](https://github.com/diegohaz/constate/pulls).

If you're a beginner, it'll be a pleasure to help you contribute. You can start by reading [the beginner's guide to contributing to a GitHub project](https://akrabat.com/the-beginners-guide-to-contributing-to-a-github-project/).

## TODO 📝

-   Middlewares? ([create an issue](https://github.com/diegohaz/constate/issues/new) if you find a use case for this)
-   Debugger/devtools
-   Memoize selectors
-   Global actions/selectors

## License ⚖️

MIT © [Diego Haz](https://github.com/diegohaz)
