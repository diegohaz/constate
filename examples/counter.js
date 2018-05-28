import React from "react";
import { Block, Button } from "reas";
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
    {({ count }) => <Block>{count}</Block>}
  </CounterContainer>
);

const CounterButton = () => (
  <CounterContainer context="counter1">
    {({ increment }) => <Button onClick={() => increment(1)}>Increment</Button>}
  </CounterContainer>
);

const Counter = () => (
  <Provider devtools>
    <CounterValue />
    <CounterButton />
  </Provider>
);

export default Counter;
