import React from "react";
import { mount } from "enzyme";
import { Container, Provider } from "../src";

export const increment = (amount = 1) => state => ({
  count: state.count + amount
});

export const getParity = () => state =>
  state.count % 2 === 0 ? "even" : "odd";

export const wrap = (props, providerProps) =>
  mount(
    <Provider {...providerProps}>
      <Container {...props}>{state => <div data-state={state} />}</Container>
    </Provider>
  );

export const getState = (wrapper, selector = "div") =>
  wrapper
    .update()
    .find(selector)
    .prop("data-state");
