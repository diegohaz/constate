import * as React from "react";
import { mount } from "enzyme";
import { Container, withContainer } from "../src";

test("withContainer", () => {
  type State = { count: number };
  type Actions = { increment: () => (oldState: State) => State };
  type Props = State & Actions;

  const initialState: State = { count: 0 };
  const actions: Actions = {
    increment: () => (state: State) => ({ count: state.count + 1 })
  };

  const TestComponent: React.ComponentType<Props> = ({ count, increment }) => (
    <button onClick={increment}>{count}</button>
  );
  const WrappedComponent = withContainer<State, Actions, {}, {}>({
    initialState,
    actions
  })(TestComponent);
  const wrapper = mount(<WrappedComponent />);

  const expected = (
    <Container initialState={initialState} actions={actions}>
      {(state: any) => <TestComponent {...state} />}
    </Container>
  );
  expect(wrapper.children().matchesElement(expected)).toEqual(true);
});
