import React from "react";
import { Provider, Container } from "../src";

const CounterContainer = props => (
  <Container
    initialState={{ count: 0 }}
    actions={{
      increment: amount => state => ({ count: state.count + amount })
    }}
    {...props}
  />
);

const CounterValue = () => (
  <CounterContainer context="counter1">
    {({ count }) => <div>{count}</div>}
  </CounterContainer>
);

const CounterButton = () => (
  <CounterContainer context="counter1">
    {({ increment }) => <button onClick={() => increment(1)}>Increment</button>}
  </CounterContainer>
);

const Counter = () => (
  <Provider>
    <CounterValue />
    <CounterButton />
  </Provider>
);

export default Counter;
