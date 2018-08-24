import * as React from "react";
import { Container, ActionMap, ComposableContainer } from "constate";

interface State {
  count: number;
}

interface Actions {
  increment: () => void;
  decrement: () => void;
}

const actions: ActionMap<State, Actions> = {
  increment: () => state => ({
    count: state.count + 1
  }),
  decrement: () => state => ({
    count: state.count - 1
  })
};

const initialState: State = {
  count: 0
};

const CounterContainer: ComposableContainer<State, Actions> = props => (
  <Container
    {...props}
    initialState={{ ...initialState, ...props.initialState }}
    actions={actions}
  />
);

export default CounterContainer;
