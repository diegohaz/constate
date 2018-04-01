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

~2KB React state management library that lets you work with local state and scale up to global state with ease. 

## Install

npm:
```sh
npm i -S constate
```

Yarn:
```sh
yarn add constate
```

## Usage

### Local state

You can start by using local state. Make the state global only when you need it.

1. Create your `State` component:
    ```jsx
    // CounterState.js
    import React from 'react'
    import { State } from 'constate'

    export const initialState = {
      count: 0,
    }

    export const actions = {
      increment: amount => state => ({ count: state.count + amount }),
    }

    export const selectors = {
      getParity: () => state => (state.count % 2 === 0 ? 'even' : 'odd'),
    }

    const CounterState = props => (
      <State 
        initialState={initialState}
        actions={actions}
        selectors={selectors}
        {...props} 
      />
    )

    export default CounterState
    ```

2. Wrap your component with `CounterState`:
    ```jsx
    // CounterButton.js
    import React from 'react'
    import CounterState from './CounterState'

    const CounterButton = () => (
      <CounterState>
        {({ count, increment, getParity }) => (
          <button onClick={() => increment(1)}>{count} {getParity()}</button>
        )} 
      </CounterState>
    )

    export default CounterButton
    ```

### Global state

Whenever you need to share state between components and/or feel the need to have a global state, just follow these steps:

1. Pass `context` property to your `State` components:
    ```jsx
    // CounterButton.js
    import React from 'react'
    import CounterState from './CounterState'

    const CounterButton = () => (
      <CounterState context="foo">
        {({ increment }) => <button onClick={() => increment(1)}>Increment</button>}
      </CounterState>
    )

    export default CounterButton
    ```
    ```jsx
    // CounterValue.js
    import React from 'react'
    import CounterState from './CounterState'

    const CounterValue = () => (
      <CounterState context="foo">
        {({ count }) => <div>{count}</div>} 
      </CounterState>
    )

    export default CounterValue
    ```

2. Wrap your root component with `Provider`:
    ```jsx
    // index.js
    import React from 'react'
    import ReactDOM from 'react-dom'
    import { Provider } from 'constate'
    import CounterButton from './CounterButton'
    import CounterValue from './CounterValue'

    const App = () => (
      <Provider>
        <CounterButton />
        <CounterValue />
      </Provider>
    )

    ReactDOM.render(<App />, document.getElementById('root'))
    ```

### Overriding `CounterState` properties

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
)
```

Now we can pass new `initialState`, `actions` and `selectors` to `CounterState`:

```jsx
export const initialState = {
  count: 10,
}

export const actions = {
  decrement: amount => state => ({ count: state.count - amount }),
}

const CounterButton = () => (
  <CounterState initialState={initialState} actions={actions}>
    {({ decrement }) => <button onClick={() => decrement(1)}>Decrement</button>}
  </CounterState>
)
```

Those new members will work even if you use `context`.

### Global initial state

You can also pass `initialState` to `Provider`:

```jsx
const initialState = {
  foo: {
    count: 10,
  },
}

const App = () => (
  <Provider initialState={initialState}>
    ...
  </Provider>
)
```

That way, components using `context=foo` will have that initial state.

## Testing

`actions` and `selectors` are pure functions. Testing is pretty straightfoward:

```js
import { initialState, actions, selectors } from './CounterState'

test('initialState', () => {
  expect(initialState).toEqual({ count: 0 })
})

test('actions', () => {
  expect(actions.increment(1)({ count: 0 })).toEqual({ count: 1 })
  expect(actions.increment(-1)({ count: 1 })).toEqual({ count: 0 })
})

test('selectors', () => {
  expect(selectors.getParity()({ count: 0 })).toBe('even')
  expect(selectors.getParity()({ count: 1 })).toBe('odd')
}) 
```

## License

MIT © [Diego Haz](https://github.com/diegohaz)
