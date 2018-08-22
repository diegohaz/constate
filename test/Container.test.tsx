import React from "react";
import { mount } from "enzyme";
import createCommonTests from "./createCommonTests";
import { increment, wrap, getState } from "./testUtils";
import { Container } from "../src";

createCommonTests({}, getState, wrap)();

test("onUnmount", () => {
  const initialState = { count: 0 };
  const onUnmount = jest.fn(({ state, setState }) => {
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
  const initialState = { count: 0 };
  const onUnmount = jest.fn(({ setState }) => {
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
