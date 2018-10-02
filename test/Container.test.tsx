import * as React from "react";
import { mount } from "enzyme";
import createCommonTests from "./createCommonTests";
import { wrap, getState } from "./testUtils";
import { Container, OnUnmountProps } from "../src";

createCommonTests({}, getState, wrap)();

test("onUnmount", () => {
  type State = { count: number };

  const initialState: State = { count: 0 };

  const onUnmount = jest.fn(({ state, setState }: OnUnmountProps<State>) => {
    expect(state).toEqual(initialState);
    expect(setState).toEqual(expect.any(Function));
  });

  const Component = ({ hide }: { hide?: boolean }) =>
    hide ? null : (
      <Container initialState={initialState} onUnmount={onUnmount}>
        {state => <div data-state={state} />}
      </Container>
    );

  const wrapper = mount(<Component />);

  expect(onUnmount).not.toHaveBeenCalled();
  wrapper.setProps({ hide: true });
  expect(onUnmount).toHaveBeenCalledTimes(1);
});

test("onUnmount setState is noop", () => {
  type State = { count: number };

  const increment = (amount = 1) => (state: State) => ({
    count: state.count + amount
  });

  const initialState: State = { count: 0 };

  const onUnmount = jest.fn(({ setState }: OnUnmountProps<State>) => {
    setState(increment(10));
  });

  const Component = ({ hide }: { hide?: boolean }) =>
    hide ? null : (
      <Container initialState={initialState} onUnmount={onUnmount}>
        {state => <div data-state={state} />}
      </Container>
    );

  const wrapper = mount(<Component />);

  wrapper.setProps({ hide: true });
  expect(onUnmount).toHaveBeenCalledTimes(1);
});
