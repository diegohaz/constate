<p align="center">
  <img src="https://raw.githubusercontent.com/diegohaz/constate/master/logo/logo.png" alt="constate logo" width="300" />
</p>
<br>

<p align="center">
  React state management library built with <strong>scalability</strong> in mind. <br>
  You can start simple with <a href="#actions">local state</a> and scale up to <a href="#context">global state</a> with ease when needed.
</p>

<p align="center">
  <a href="https://medium.freecodecamp.org/reacts-new-context-api-how-to-toggle-between-local-and-global-state-c6ace81443d0"><strong>👓 Read the introductory article</strong></a>&nbsp; · &nbsp;
  <a href="https://codesandbox.io/s/7p2qv6mmq"><strong>🎮 Play with the demo</strong></a>
</p>

<br>

<p align="center">
  <a href="https://npmjs.org/package/constate"><img alt="NPM version" src="https://img.shields.io/npm/v/constate.svg?style=flat-square"></a>
  <a href="https://unpkg.com/constate"><img alt="Gzip size" src="https://img.badgesize.io/https://unpkg.com/constate?style=flat-square&compression=gzip"></a>
  <a href="https://david-dm.org/diegohaz/constate"><img alt="Dependencies" src="https://img.shields.io/david/diegohaz/constate/master.svg?style=flat-square"></a>
  <a href="https://travis-ci.org/diegohaz/constate"><img alt="Build Status" src="https://img.shields.io/travis/diegohaz/constate/master.svg?style=flat-square"></a>
  <a href="https://codecov.io/gh/diegohaz/constate/branch/master"><img alt="Coverage Status" src="https://img.shields.io/codecov/c/github/diegohaz/constate/master.svg?style=flat-square"></a>
</p>

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

#### Table of Contents

- [Installation](#installation)
- [`Container`](#container)
  - [`initialState`](#initialstate)
  - [`actions`](#actions)
  - [`selectors`](#selectors)
  - [`effects`](#effects)
  - [`context`](#context)
  - [`onMount`](#onmount)
  - [`onUpdate`](#onupdate)
  - [`onUnmount`](#onunmount)
  - [`shouldUpdate`](#shouldupdate)
  - [`pure`](#pure)
- [`Provider`](#provider)
  - [`initialState`](#initialstate-1)
  - [`onMount`](#onmount-1)
  - [`onUpdate`](#onupdate-1)
  - [`onUnmount`](#onunmount-1)
  - [`devtools`](#devtools)
- [TypeScript](#typescript)
- [Testing](#testing)

## Installation

```sh
npm i constate
```

<br>

## `Container`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

> In computer science, a **container** is a class, a data structure, or an abstract data type (ADT) whose instances are collections of other objects. In other words, they store objects in an organized way that follows specific access rules.
>
> — <https://en.wikipedia.org/wiki/Container_(abstract_data_type)>

### `initialState`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type initialState = object;
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

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type Actions = {
  [key: string]: (...args: any[]) => 
    ((state: object) => object) | object
};
```

An action is a method that returns an `updater` function, which will be, internally, passed as an argument to React `setState`. Actions will be exposed, then, together with state within the child function.

You can also return the object directly if you don't need `state`.

```jsx
const initialState = { count: 0 };

const actions = {
  increment: amount => state => ({ count: state.count + amount })
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

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type Selectors = {
  [key: string]: (...args: any[]) => 
    (state: object) => any
};
```

A selector is a method that returns a function, which receives the current state and should return something (the thing being selected).

```jsx
const initialState = { count: 0 };

const actions = {
  increment: amount => state => ({ count: state.count + amount })
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

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type Effects = {
  [key: string]: (...args: any[]) => 
    (props: { state: object, setState: Function }) => void
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

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type Context = string;
```

Whenever you need to share state between components and/or feel the need to have a global state, you can pass a `context` prop to `Container` and wrap your app with `Provider`.

> Due to how React Context works, `Container`s with `context` prop will re-render on every context state change. It's recommended to use [`pure`](#pure) or [`shouldUpdate`](#shouldupdate) so as to avoid unnecessary re-renders.

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
  <CounterContainer context="counter1" pure>
    {({ increment }) => <button onClick={increment}>Increment</button>}
  </CounterContainer>
);

const CounterValue = () => (
  <CounterContainer context="counter1" pure>
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

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type OnMount = (props: {
  state: object,
  setState: Function
}) => void;
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

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/40272346-be92ffb8-5b79-11e8-906f-a653e284002e.gif" alt="Example"></p>

### `onUpdate`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type OnUpdate = (props: { 
  prevState: object, 
  state: object, 
  setState: Function,
  type: string
}) => void;
```

This is a function called every time `setState` is called, either internally with [`actions`](#actions) or directly with [`effects`](#effects) and lifecycle methods, including `onUpdate` itself.

Besides `prevState`, `state` and `setState`, it receives a `type` property, which can be either the name of the `action`, `effect` or one of the lifecycle methods that triggered it, including `onUpdate` itself.

> Note: when using [`context`](#context), `onUpdate` will be triggered only once per `setState` call no matter how many `Container`s of the same context you have mounted.

```jsx
const initialState = { count: 0 };

const onMount = ({ setState }) => {
  const fn = () => setState(state => ({ count: state.count + 1 }));
  setInterval(fn, 1000);
};

const onUpdate = ({ state, setState, type }) => {
  if (type === "onMount" && state.count === 5) {
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

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/40272385-512d74de-5b7a-11e8-85da-974e53c7887f.gif" alt="Example"></p>

### `onUnmount`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type OnUnmount = (props: {
  state: object,
  setState: Function
}) => void;
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
  <Container initialState={initialState} onMount={onMount} onUnmount={onUnmount}>
    {({ count }) => <button>{count}</button>}
  </Container>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/40272496-083be31c-5b7c-11e8-9e0e-5fa623495ed4.gif" alt="Example"></p>

### `shouldUpdate`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type ShouldUpdate = (props: {
  state: object,
  nextState: object
}) => boolean;
```

This is a function called inside `Container`s `shouldComponentUpdate`. It receives the current `state` and `nextState` and should return `true` or `false`. If it returns `false`, `onUpdate` won't be called for that change, and it won't trigger another render.

In the previous example using [`onUnmount`](#onunmount), we stored the result of `setInterval` in the state. That's ok to do, but the downside is that it would trigger an additional render, even though our UI didn't depend on `state.interval`. We can use `shouldUpdate` to ignore `state.interval`, for example:

```jsx
const initialState = { count: 0, updates: 0 };

const onMount = ({ setState }) => {
  const fn = () => setState(state => ({ count: state.count + 1 }));
  const interval = setInterval(fn, 1000);
  setState({ interval });
};

const onUnmount = ({ state }) => {
  clearInterval(state.interval);
};

const onUpdate = ({ type, setState }) => {
  // prevent infinite loop
  if (type !== "onUpdate") {
    setState(state => ({ updates: state.updates + 1 }));
  }
};

// Don't call onUpdate and render if `interval` has changed
const shouldUpdate = ({ state, nextState }) =>
  state.interval === nextState.interval;

const Counter = () => (
  <Container
    initialState={initialState}
    onMount={onMount}
    onUnmount={onUnmount}
    onUpdate={onUpdate}
    shouldUpdate={shouldUpdate}
  >
    {({ count, updates }) => (
      <Button>
        Count: {count}
        <br />
        Updates: {updates}
      </Button>
    )}
  </Container>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/42988517-3d1f069a-8bd3-11e8-9742-e3294a863bb0.gif" alt="Example"></p>

### `pure`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type Pure = boolean;
```

You can pass `pure` prop to your `Container` so it will re-render only if its `state` has changed, ignoring other props. It'll help you if you're having performance issues within your app.

Due to how React Context works, all `Container`s with a [`context`](#context) prop will re-render when context state changes. Using `pure` will ensure that it will trigger an update only for its own context.

`pure` is equivalent to this implementation of [`shouldUpdate`](#shouldupdate):

```js
const shouldUpdate = ({ state, nextState }) => state !== nextState;
```

But you can use both props. `shouldUpdate` will be applied after `pure`, which means that, if state is the same, it'll never re-render even if you do `shouldUpdate={() => true}`.

> It's safe to pass `pure` to all your containers, and remove it only if you see unintended results on your UI, such as some part of the UI not updating correctly.

<br>

## `Provider`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

You should wrap your app with `Provider` if you want to use [`context`](#context).

### `initialState`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type InitialState = object;
```

It's possible to pass initialState to Provider. In the example below, all `Container`s with `context="counter1"` will start with `{ count: 10 }`.

> Note: when using [`context`](#context), only the `initialState` of the first `Container` in the tree will be considered. `Provider` will always take precedence over `Container`.

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

### `onMount`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type OnMount = (props: {
  state: object,
  setContextState: Function
}) => void;
```

As well as with `Container`, you can pass an `onMount` prop to `Provider`. The function will be called when `Provider`'s `componentDidMount` gets called.

```jsx
const onMount = ({ setContextState }) => {
  setContextState("counter1", { count: 0 });
};

const MyProvider = props => (
  <Provider onMount={onMount} {...props} />
);

const App = () => (
  <MyProvider>
    ...
  </MyProvider>
);
```

### `onUpdate`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type OnUpdate = (props: { 
  prevState: object,
  state: object,
  setContextState: Function,
  context: string,
  type: string
}) => void;
```

`onUpdate` will be called every time `Provider`'s `setState` gets called. If `setContextState` was called instead, `onUpdate` will also receive a `context` prop.

`Container`s, when the `context` prop is defined, use `setContextState` internally, which means that `Provider`'s `onUpdate` will be triggered for every change on the context.

```jsx
const initialState = { counter1: { incrementCalls: 0 } };

const onUpdate = ({ context, type, setContextState }) => {
  if (type === "increment") {
    setContextState(context, state => ({
      incrementCalls: state.incrementCalls + 1
    }));
  }
};

const MyProvider = props => (
  <Provider initialState={initialState} onUpdate={onUpdate} {...props} />
);

const CounterContainer = props => (
  <Container
    initialState={{ count: 0 }}
    actions={{ increment: () => state => ({ count: state.count + 2 }) }}
    {...props}
  />
);

const Counter = () => (
  <MyProvider>
    <CounterContainer context="counter1">
      {({ count, incrementCalls, increment }) => (
        <button onClick={increment}>
          count: {count}<br />
          incrementCalls: {incrementCalls}
        </button>
      )}
    </CounterContainer>
  </MyProvider>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/40588505-8e10891e-61b4-11e8-81ae-c947220ae4d2.gif" alt="Example"></p>

### `onUnmount`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type OnUnmount = (props: { state: object }) => void;
```

`onUnmount` will be triggered in `Provider`'s `componentWillUnmount`.

```jsx
const onUnmount = ({ state }) => {
  console.log(state);
};

const App = () => (
  <Provider onUnmount={onUnmount}>
    ...
  </Provider>
);
```

### `devtools`

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

```ts
type Devtools = boolean;
```

Passing `devtools` prop to `Provider` will enable [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension) integration, if that's installed on your browser. With that, you can easily debug the state of your application.

```jsx
const App = () => (
  <Provider devtools>
    ...
  </Provider>
);
```

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/40630279-c31d4f36-62a7-11e8-96f2-052c97985747.gif" alt="Example"></p>

Note that it only works for context state. If you want to debug local state, you can add a `context` prop to `Container` temporarily.

Alternatively, you can use `onUpdate` to log changes on the console:

```jsx
<CounterContainer onUpdate={console.log} />
```

<br>

## TypeScript

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

Constate is written in TypeScript and exports many useful types to help you. When creating a new container, you can start by defining its **public API**. That is, the props that are passed to the children function:

```ts
interface State {
  count: number;
}

interface Actions {
  increment: (amount?: number) => void; // actions always return void
}

interface Selectors {
  getParity: () => "even" | "odd";
}

interface Effects {
  tick: () => void;
}
```

In computer programming, it's a good practice to define the API before actually implementing it. This way, you're explicitly saying how the container should be consumed. Then, you can use handful interfaces exported by Constate to create your container:

```ts
import { ActionMap, SelectorMap, EffectMap } from "constate";

const initialState: State = {
  count: 0
};

const actions: ActionMap<State, Actions> = {
  increment: (amount = 1) => state => ({ count: state.count + amount })
};

const selectors: SelectorMap<State, Selectors> = {
  getParity: () => state => (state.count % 2 === 0 ? "even" : "odd")
};

const effects: EffectsMap<State, Effects> = {
  tick: () => ({ setState }) => {
    const fn = () => setState(state => ({ count: state.count + 1 }));
    setInterval(fn, 1000);
  }
}
```

Those interfaces (e.g. `ActionMap`) will create a map using your `State` and your public API (e.g. `Actions`).

If you're using VSCode or other code editor that supports TypeScript, you'll probably have a great developer experience. Tooling will infer types and give you autocomplete for most things:

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/44436323-eb817580-a58a-11e8-8077-9f27ff283c5e.gif" alt="Example"></p>

Then, you just need to pass those maps to [`Container`](#container):

```jsx
const Counter = () => (
  <Container
    initialState={initialState}
    actions={actions}
    selectors={selectors}
    effects={effects}
  >
    {({ count, increment, getParity, tick }) => ...}
  </Container>
);
```

It'll also provide autocomplete and hints on the public API:

<p align="center"><img src="https://user-images.githubusercontent.com/3068563/44436560-3fd92500-a58c-11e8-84b2-cd9c8c3fddc6.gif" alt="Example"></p>

If you're building a composable container - that is, a component without `children` that receives props -, you can define your component as a `ComposableContainer`:

```jsx
import { Container, ComposableContainer } from "constate";

const CounterContainer: ComposableContainer<State, Actions, Selectors, Effects> = props => (
  <Container
    {...props}
    initialState={{ ...initialState, ...props.initialState }}
    actions={actions}
    selectors={selectors}
    effects={effects}
  />
);
```

Then, you can use it in other parts of your application and still take advantage from typings. `ComposableContainer` will handle them for you: 

```jsx
const Counter = () => (
  <CounterContainer initialState={{ count: 10 }} context="counter1">
    {({ count, increment, getParity, tick }) => ...}
  </CounterContainer>
);
```

> `ComposableContainer` doesn't accept other `actions`, `selectors` and `effects` as props. That's because, as of today, there's no way for TypeScript to dynamically merge props and infer their types correctly.

There're also useful interfaces for lifecycle methods. You can find them all in [`src/types.ts`](src/types.ts).

<br>

## Testing

<sup><a href="#table-of-contents">↑ Back to top</a></sup>

[`actions`](#actions) and [`selectors`](#selectors) are pure functions and you can test them directly:
```js
test("increment", () => {
  expect(increment(1)({ count: 0 })).toEqual({ count: 1 });
  expect(increment(-1)({ count: 1 })).toEqual({ count: 0 });
});

test("getParity", () => {
  expect(getParity()({ count: 0 })).toBe("even");
  expect(getParity()({ count: 1 })).toBe("odd");
});
```

On the other hand, [`effects`](#effects) and lifecycle methods can be a little tricky to test depending on how you implement them.

<br>

## Contributing

If you find a bug, please [create an issue](https://github.com/diegohaz/constate/issues/new) providing instructions to reproduce it. It's always very appreciable if you find the time to fix it. In this case, please [submit a PR](https://github.com/diegohaz/constate/pulls).

If you're a beginner, it'll be a pleasure to help you contribute. You can start by reading [the beginner's guide to contributing to a GitHub project](https://akrabat.com/the-beginners-guide-to-contributing-to-a-github-project/).

Run `npm start` to run examples.

<br>

## License

MIT © [Diego Haz](https://github.com/diegohaz)
