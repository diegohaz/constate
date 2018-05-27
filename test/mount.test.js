import React from "react";
import { mount, Container } from "../src";
import { increment } from "./testUtils";
import createCommonTests from "./createCommonTests";

const wrap = props => mount(p => <Container {...props} {...p} />);

const getState = wrapper => wrapper;

test("nested container", () => {
  const CounterContainer = props => (
    <Container initialState={{ count: 0 }} {...props} />
  );
  const IncrementableCounterContainer = props => (
    <CounterContainer actions={{ increment }} {...props} />
  );
  const DecrementableIncrementableCounterContainer = () => (
    <IncrementableCounterContainer
      initialState={{ count: 10, foo: "bar" }}
      actions={{ decrement: () => state => ({ count: state.count - 1 }) }}
    />
  );
  const wrapper = mount(DecrementableIncrementableCounterContainer);
  expect(wrapper).toEqual({
    count: 10,
    foo: "bar",
    decrement: expect.any(Function)
  });
});

test("React element", () => {
  const wrapper = mount(
    <Container initialState={{ count: 0 }}>{() => null}</Container>
  );
  expect(wrapper).toEqual({ count: 0 });
});

createCommonTests({}, getState, wrap)();
