import React from "react";
import { mount } from "enzyme";
import { increment, wrap, getState } from "./testUtils";
import createCommonTests from "./createCommonTests";
import { Provider, Container, Consumer } from "../src";

createCommonTests({ context: "foo" }, getState, wrap)();

test("Provider initialState", () => {
  const initialState = { foo: { count: 0 } };
  const wrapper = wrap({ context: "foo" }, { initialState });
  expect(getState(wrapper)).toEqual({ count: 0 });
});

test("Provider multiple initialState", () => {
  const initialState = { foo: { count: 0, foo: "bar" }, bar: {} };
  const wrapper = wrap({ context: "foo" }, { initialState });
  expect(getState(wrapper)).toEqual({ count: 0, foo: "bar" });
});

test("multiple contexts", () => {
  const initialState = { foo: { count: 0 }, bar: { count: 1 } };
  const actions = { increment };
  const wrapper = mount(
    <Provider initialState={initialState}>
      <Container context="foo" actions={actions}>
        {state => <div data-state={state} />}
      </Container>
      <Container context="bar" actions={actions}>
        {state => <span data-state={state} />}
      </Container>
    </Provider>
  );
  expect(getState(wrapper, "div")).toEqual({
    count: 0,
    increment: expect.any(Function)
  });
  expect(getState(wrapper, "span")).toEqual({
    count: 1,
    increment: expect.any(Function)
  });
  getState(wrapper, "div").increment(2);
  expect(getState(wrapper, "div").count).toBe(2);
  getState(wrapper, "span").increment(2);
  expect(getState(wrapper, "span").count).toBe(3);
});

test("context initialState overrides local initialState", () => {
  const initialState = { foo: { count: 0 } };
  const wrapper = wrap(
    { context: "foo", initialState: { count: 1 } },
    { initialState }
  );
  expect(getState(wrapper)).toEqual({ count: 0 });
});

test("Provider onMount", () => {
  const initialState = { counter1: { count: 0 } };
  const onMount = jest.fn(({ state, setContextState }) => {
    expect(state).toEqual(initialState);
    setContextState("counter1", { count: 10 });
  });
  const wrapper = wrap({ context: "counter1" }, { initialState, onMount });
  expect(onMount).toHaveBeenCalledTimes(1);
  expect(getState(wrapper)).toEqual({ count: 10 });
});

test("Provider onUpdate", () => {
  expect.assertions(7);
  const initialState = { count: 0 };
  const actions = { increment };
  const onUpdate = jest.fn(
    ({ state, prevState, setContextState, context, type }) => {
      if (context === "counter1" && type === "initialState") {
        expect(prevState).toEqual({});
        expect(state).toEqual({ counter1: { count: 0 } });
      } else if (context === "counter1" && type === "increment") {
        expect(state).toEqual({ counter1: { count: 1 } });
        expect(state[context]).toEqual({ count: 1 });
        setContextState("foo", { bar: 1 });
      } else if (type === "Provider/onUpdate") {
        expect(state).toEqual({ counter1: { count: 1 }, foo: { bar: 1 } });
      }
    }
  );
  const wrapper = wrap(
    { context: "counter1", actions, initialState },
    { onUpdate }
  );
  getState(wrapper).increment(1);
  expect(onUpdate).toHaveBeenCalledTimes(3);
  expect(getState(wrapper).count).toBe(1);
});

test("Provider onUnmount", () => {
  const initialState = { counter1: { count: 0 } };
  const onUnmount = jest.fn();
  const Component = ({ hide }: { hide?: boolean }) =>
    hide ? null : (
      <Provider initialState={initialState} onUnmount={onUnmount}>
        <div />
      </Provider>
    );
  const wrapper = mount(<Component />);
  expect(onUnmount).toHaveBeenCalledTimes(0);
  wrapper.setProps({ hide: true });
  expect(onUnmount).toHaveBeenCalledTimes(1);
  expect(onUnmount).toHaveBeenCalledWith({
    state: { counter1: { count: 0 } }
  });
});

test("only the first onMount should be called", () => {
  const onMount1 = jest.fn();
  const onMount2 = jest.fn();
  const MyContainer = props => <Container context="foo" {...props} />;
  mount(
    <Provider>
      <MyContainer onMount={onMount1}>
        {state => <div data-state={state} />}
      </MyContainer>
      <MyContainer onMount={onMount2}>
        {state => <span data-state={state} />}
      </MyContainer>
    </Provider>
  );
  expect(onMount1).toHaveBeenCalledTimes(1);
  expect(onMount2).toHaveBeenCalledTimes(0);
});

test("onUpdate should be called only for the caller container", () => {
  const onUpdate1 = jest.fn();
  const onUpdate2 = jest.fn();
  const initialState = { count: 0 };
  const actions = { increment };
  const MyContainer = props => (
    <Container
      context="foo"
      initialState={initialState}
      actions={actions}
      {...props}
    />
  );
  const wrapper = mount(
    <Provider>
      <MyContainer onUpdate={onUpdate1}>
        {state => <div data-state={state} />}
      </MyContainer>
      <MyContainer onUpdate={onUpdate2}>
        {state => <span data-state={state} />}
      </MyContainer>
    </Provider>
  );
  getState(wrapper, "div").increment();
  expect(onUpdate1).toHaveBeenCalledTimes(1);
  expect(onUpdate2).toHaveBeenCalledTimes(0);
  getState(wrapper, "span").increment();
  expect(onUpdate1).toHaveBeenCalledTimes(1);
  expect(onUpdate2).toHaveBeenCalledTimes(1);
});

test("onUpdate should be trigerred on onUnmount", () => {
  const initialState = { count: 0 };
  const onUpdate = jest.fn();
  const onUnmount = ({ setState }) => setState(increment(10));
  const Component = ({ hide }: { hide?: boolean }) => (
    <Provider>
      {!hide && (
        <Container
          context="foo"
          onUpdate={onUpdate}
          onUnmount={onUnmount}
          initialState={initialState}
        >
          {() => <div />}
        </Container>
      )}
    </Provider>
  );
  const wrapper = mount(<Component />);
  expect(onUpdate).toHaveBeenCalledTimes(0);
  wrapper.setProps({ hide: true });
  expect(onUpdate).toHaveBeenCalledTimes(1);
});

test("onUpdate onUnmount type", () => {
  const initialState = { count: 0 };
  const onUpdate = jest.fn();
  const onUnmount = ({ setState }) => setState(increment(10));
  const Component = ({ hide }: { hide?: boolean }) => (
    <Provider>
      {!hide && (
        <Container
          context="foo"
          onUpdate={onUpdate}
          onUnmount={onUnmount}
          initialState={initialState}
        >
          {() => <div />}
        </Container>
      )}
    </Provider>
  );
  const wrapper = mount(<Component />);
  wrapper.setProps({ hide: true });
  expect(onUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "onUnmount"
    })
  );
});

test("onUnmount should be called only for the last unmounted container", () => {
  const onUnmount1 = jest.fn();
  const onUnmount2 = jest.fn();
  const MyContainer = props => <Container context="foo" {...props} />;
  const Component = ({
    hide1,
    hide2
  }: {
    hide1?: boolean;
    hide2?: boolean;
  }) => (
    <Provider>
      {!hide1 && <MyContainer onUnmount={onUnmount1}>{() => null}</MyContainer>}
      {!hide2 && <MyContainer onUnmount={onUnmount2}>{() => null}</MyContainer>}
    </Provider>
  );
  const wrapper = mount(<Component />);
  wrapper.setProps({ hide1: true });
  expect(onUnmount1).toHaveBeenCalledTimes(0);
  expect(onUnmount2).toHaveBeenCalledTimes(0);
  wrapper.setProps({ hide2: true });
  expect(onUnmount1).toHaveBeenCalledTimes(0);
  expect(onUnmount2).toHaveBeenCalledTimes(1);
});

test("onUnmount setState", () => {
  const initialState = { count: 0 };
  const onUnmount = ({ setState }) => setState(increment(10));
  const Component = ({ hide }: { hide?: boolean }) => (
    <Provider>
      {!hide && (
        <Container
          context="foo"
          onUnmount={onUnmount}
          initialState={initialState}
        >
          {() => <div />}
        </Container>
      )}
      <Consumer>{ctx => <span data-state={ctx.state.foo} />}</Consumer>
    </Provider>
  );
  const wrapper = mount(<Component />);
  expect(getState(wrapper, "span")).toEqual({ count: 0 });
  wrapper.setProps({ hide: true });
  expect(getState(wrapper, "span")).toEqual({ count: 10 });
});

test("onUnmount setState callback", () => {
  const initialState = { count: 0 };
  const onUnmount = ({ setState }) => {
    setState(increment(1), () => {
      setState(increment(10), () => {
        setState(increment(100));
      });
    });
  };
  const Component = ({ hide }: { hide?: boolean }) => (
    <Provider>
      {!hide && (
        <Container
          context="foo"
          onUnmount={onUnmount}
          initialState={initialState}
        >
          {() => <div />}
        </Container>
      )}
      <Consumer>{ctx => <span data-state={ctx.state.foo} />}</Consumer>
    </Provider>
  );
  const wrapper = mount(<Component />);
  expect(getState(wrapper, "span")).toEqual({ count: 0 });
  wrapper.setProps({ hide: true });
  expect(getState(wrapper, "span")).toEqual({ count: 111 });
});

test("onUnmount delayed", () => {
  jest.useFakeTimers();
  const initialState = { count: 0 };
  const onUnmount = ({ setState }) => {
    setTimeout(() => setState(increment(10)), 1000);
  };
  const Component = ({ hide }: { hide?: boolean }) => (
    <Provider>
      {!hide && (
        <Container
          context="foo"
          onUnmount={onUnmount}
          initialState={initialState}
        >
          {() => <div />}
        </Container>
      )}
      <Consumer>{ctx => <span data-state={ctx.state.foo} />}</Consumer>
    </Provider>
  );
  const wrapper = mount(<Component />);
  expect(getState(wrapper, "span")).toEqual({ count: 0 });
  wrapper.setProps({ hide: true });
  expect(getState(wrapper, "span")).toEqual({ count: 0 });
  jest.advanceTimersByTime(1000);
  expect(getState(wrapper, "span")).toEqual({ count: 10 });
});

test("first initialState should take precedence over others", () => {
  const wrapper = mount(
    <Provider>
      <Container initialState={{ count: 0 }} context="foo">
        {state => <div data-state={state} />}
      </Container>
      <Container initialState={{ count: 10, foo: "bar" }} context="foo">
        {state => <span data-state={state} />}
      </Container>
    </Provider>
  );
  expect(getState(wrapper, "div")).toEqual({
    count: 0,
    foo: "bar"
  });
  expect(getState(wrapper, "span")).toEqual({
    count: 0,
    foo: "bar"
  });
});
