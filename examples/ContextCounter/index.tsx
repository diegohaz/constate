import * as React from "react";
import { Provider } from "constate";
import { Group, Button, Heading } from "reakit";
import CounterContainer from "./container";

const Example = () => (
  <Provider devtools>
    <Heading as="h2">Single Counter Container</Heading>
    <CounterContainer>
      {({ count, increment, decrement }) => (
        <React.Fragment>
          <div>{count}</div>
          <Group>
            <Button onClick={increment}>+</Button>
            <Button onClick={decrement}>-</Button>
          </Group>
        </React.Fragment>
      )}
    </CounterContainer>

    <Heading as="h2">Shared Counter Container</Heading>

    <CounterContainer context="shared">
      {({ count, increment, decrement }) => (
        <React.Fragment>
          <div>{count}</div>
          <Group>
            <Button onClick={increment}>+</Button>
            <Button onClick={decrement}>-</Button>
          </Group>
        </React.Fragment>
      )}
    </CounterContainer>

    <CounterContainer context="shared">
      {({ count, increment, decrement }) => (
        <React.Fragment>
          <div>{count}</div>
          <Group>
            <Button onClick={increment}>+</Button>
            <Button onClick={decrement}>-</Button>
          </Group>
        </React.Fragment>
      )}
    </CounterContainer>
  </Provider>
);

export default Example;
