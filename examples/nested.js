import React from "react";
import { Provider, Container } from "../src";

const CounterContainer = props => (
  <Container
    initialState={{ count: 0 }}
    actions={{
      increment: () => state => ({ count: state.count + 1 })
    }}
    {...props}
  />
);

const Counter = () => (
  <CounterContainer context="counter1" pure>
    {counter1 => (
      <div>
        <button onClick={counter1.increment}>{counter1.count}</button>
        <CounterContainer context="counter2">
          {counter2 => (
            <button onClick={counter2.increment}>
              {counter1.count /* uses external prop */}
              {counter2.count}
            </button>
          )}
        </CounterContainer>
      </div>
    )}
  </CounterContainer>
);

const Nested = () => (
  <Provider devtools>
    <Counter />
  </Provider>
);

export default Nested;
