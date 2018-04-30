import React from "react";
import { mount } from "enzyme";
import { Container, Provider } from "../src";

const wrap = (initialState, props, providerProps) =>
  mount(
    <Provider {...providerProps}>
      <Container initialState={initialState} {...props}>
        {state => <div state={state} />}
      </Container>
    </Provider>
  );

const getState = (wrapper, selector = "div") =>
  wrapper
    .update()
    .find(selector)
    .prop("state");

const createTests = props => () => {
  test("initialState", () => {
    const initialState = { foo: "bar" };
    const wrapper = wrap(initialState, props);
    expect(getState(wrapper)).toEqual(initialState);
  });

  test("multiple initialState", () => {
    const initialState = { foo: "bar", baz: "qux" };
    const wrapper = wrap(initialState, props);
    expect(getState(wrapper)).toEqual(initialState);
  });

  test("actions", () => {
    const initialState = { count: 0 };
    const actions = {
      increment: amount => state => ({ count: state.count + amount })
    };
    const wrapper = wrap(initialState, { actions, ...props });
    expect(getState(wrapper)).toEqual({
      count: 0,
      increment: expect.any(Function)
    });
    getState(wrapper).increment(2);
    expect(getState(wrapper)).toEqual(expect.objectContaining({ count: 2 }));
  });

  test("actions with mutiple initialState", () => {
    const initialState = { count: 0, foo: "bar" };
    const actions = {
      increment: amount => state => ({ count: state.count + amount })
    };
    const wrapper = wrap(initialState, { actions, ...props });
    expect(getState(wrapper)).toEqual({
      count: 0,
      foo: "bar",
      increment: expect.any(Function)
    });
    getState(wrapper).increment(2);
    expect(getState(wrapper)).toEqual(
      expect.objectContaining({ count: 2, foo: "bar" })
    );
  });

  test("selectors", () => {
    const initialState = { count: 0 };
    const selectors = {
      getParity: () => state => (state.count % 2 === 0 ? "even" : "odd")
    };
    const wrapper = wrap(initialState, { selectors, ...props });
    expect(getState(wrapper)).toEqual({
      count: 0,
      getParity: expect.any(Function)
    });
    expect(getState(wrapper).getParity()).toBe("even");
  });

  test("selectors with mutiple initialState", () => {
    const initialState = { count: 0, foo: "bar" };
    const selectors = {
      getParity: () => state => (state.count % 2 === 0 ? "even" : "odd")
    };
    const wrapper = wrap(initialState, { selectors, ...props });
    expect(getState(wrapper)).toEqual({
      count: 0,
      foo: "bar",
      getParity: expect.any(Function)
    });
    expect(getState(wrapper).getParity()).toBe("even");
  });

  test("effects", () => {
    jest.useFakeTimers();
    const initialState = { count: 0 };
    const increment = amount => state => ({ count: state.count + amount });
    const effects = {
      tick: () => ({ setState }) => {
        setState(increment(1));
        setTimeout(() => effects.tick()({ setState }), 1000);
      }
    };
    const wrapper = wrap(initialState, { effects, ...props });
    expect(getState(wrapper)).toEqual({ count: 0, tick: expect.any(Function) });
    getState(wrapper).tick();
    expect(getState(wrapper).count).toBe(1);
    jest.advanceTimersByTime(1000);
    expect(getState(wrapper).count).toBe(2);
    jest.advanceTimersByTime(1000);
    expect(getState(wrapper).count).toBe(3);
  });

  test("onInit", () => {
    const initialState = { count: 0 };
    const onInit = ({ state, setState }) => {
      if (state.count === 0) {
        setState(prevState => ({ count: prevState.count + 10 }));
      }
    };
    const wrapper = wrap(initialState, { onInit, ...props });
    expect(getState(wrapper)).toEqual({ count: 10 });
  });

  test("onInit delayed", () => {
    jest.useFakeTimers();
    const initialState = { count: 0 };
    const onInit = ({ setState }) => {
      setTimeout(() => {
        setState(prevState => ({ count: prevState.count + 10 }));
      }, 1000);
    };
    const wrapper = wrap(initialState, { onInit, ...props });
    expect(getState(wrapper)).toEqual({ count: 0 });
    jest.advanceTimersByTime(1000);
    expect(getState(wrapper)).toEqual({ count: 10 });
  });

  test("onMount", () => {
    const initialState = { count: 0 };
    const onMount = jest.fn(({ state, setState }) => {
      if (state.count === 0) {
        setState(prevState => ({ count: prevState.count + 10 }));
      }
    });
    const wrapper = wrap(initialState, { onMount, ...props });
    expect(onMount).toHaveBeenCalledTimes(1);
    expect(getState(wrapper)).toEqual({ count: 10 });
  });

  test("onUpdate", () => {
    const initialState = { count: 0 };
    const actions = {
      increment: amount => state => ({ count: state.count + amount })
    };
    const onUpdate = jest.fn(({ prevState, setState }) => {
      if (prevState.count === 0) {
        setState(actions.increment(10));
      }
    });
    const wrapper = wrap(initialState, { onUpdate, actions, ...props });
    getState(wrapper).increment(10);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(getState(wrapper).count).toBe(20);
  });

  test("onBeforeUnmount", () => {
    const onBeforeUnmount = jest.fn();
    const wrapper = wrap(undefined, { onBeforeUnmount, ...props });
    // wrong
    // can't unmount provider
    wrapper.unmount();
    expect(onBeforeUnmount).toHaveBeenCalledTimes(1);
  });
};

describe("local", createTests());

describe("global", () => {
  test("global initialState", () => {
    const initialState = { foo: { count: 0 } };
    const wrapper = wrap(undefined, { context: "foo" }, { initialState });
    expect(getState(wrapper)).toEqual({
      count: 0
    });
  });

  test("global multiple initialState", () => {
    const initialState = { foo: { count: 0, foo: "bar" }, bar: {} };
    const wrapper = wrap(undefined, { context: "foo" }, { initialState });
    expect(getState(wrapper)).toEqual({
      count: 0,
      foo: "bar"
    });
  });

  test("global multiple contexts", () => {
    const initialState = { foo: { count: 0 }, bar: { count: 1 } };
    const actions = {
      increment: amount => state => ({ count: state.count + amount })
    };
    const wrapper = mount(
      <Provider initialState={initialState}>
        <Container context="foo" actions={actions}>
          {state => <div state={state} />}
        </Container>
        <Container context="bar" actions={actions}>
          {state => <span state={state} />}
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

  test("global initialState overrides local initialState", () => {
    const initialState = { foo: { count: 0 } };
    const wrapper = wrap(
      undefined,
      { context: "foo", initialState: { count: 1 } },
      { initialState }
    );
    expect(getState(wrapper)).toEqual({
      count: 0
    });
  });

  test("only the first onInit should be called", () => {
    const onInit = jest.fn();
    mount(
      <Provider>
        <Container context="foo" onInit={onInit}>
          {state => <div state={state} />}
        </Container>
        <Container context="foo" onInit={onInit}>
          {state => <span state={state} />}
        </Container>
      </Provider>
    );
    expect(onInit).toHaveBeenCalledTimes(1);
  });

  test("only the first onMount should be called", () => {
    const onMount = jest.fn();
    mount(
      <Provider>
        <Container context="foo" onMount={onMount}>
          {state => <div state={state} />}
        </Container>
        <Container context="foo" onMount={onMount}>
          {state => <span state={state} />}
        </Container>
      </Provider>
    );
    expect(onMount).toHaveBeenCalledTimes(1);
  });

  test("onUpdate should be called only for the first mounted container", () => {
    const onUpdate = jest.fn();
    const initialState = { count: 0 };
    const actions = {
      increment: () => state => ({ count: state.count + 1 })
    };
    const MyContainer = props => (
      <Container
        context="foo"
        onUpdate={onUpdate}
        initialState={initialState}
        actions={actions}
        {...props}
      />
    );
    const wrapper = mount(
      <Provider>
        <MyContainer>{state => <div state={state} />}</MyContainer>
        <MyContainer>{state => <span state={state} />}</MyContainer>
      </Provider>
    );
    getState(wrapper, "div").increment();
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  test("only the last onBeforeUnmount should be called", () => {
    const onBeforeUnmount = jest.fn();
    // adjust
    const Component = props => (
      <Provider>
        {!props.hide1 && (
          <Container context="foo" onBeforeUnmount={onBeforeUnmount}>
            {state => <div state={state} />}
          </Container>
        )}
        {!props.hide2 && (
          <Container context="foo" onBeforeUnmount={onBeforeUnmount}>
            {state => <span state={state} />}
          </Container>
        )}
        <div />
      </Provider>
    );
    const wrapper = mount(<Component />);
    wrapper.setProps({ hide1: true });
    expect(onBeforeUnmount).toHaveBeenCalledTimes(1);
    wrapper.setProps({ hide2: true });
    expect(onBeforeUnmount).toHaveBeenCalledTimes(1);
  });

  test("first initialState should take precedence over others", () => {
    const wrapper = mount(
      <Provider>
        <Container initialState={{ count: 0 }} context="foo">
          {state => <div state={state} />}
        </Container>
        <Container initialState={{ count: 10, foo: "bar" }} context="foo">
          {state => <span state={state} />}
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

  createTests({ context: "foo" })();
});
