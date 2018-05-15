/* eslint-disable react/prop-types */
import React from "react";
import { mount } from "enzyme";
import { Container, Provider, Consumer } from "../src";

const increment = (amount = 1) => state => ({ count: state.count + amount });

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
    const actions = { increment };
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
    const actions = { increment };
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

  test("effects with setState callback", () => {
    const initialState = { count: 0 };
    const effects = {
      tick: () => ({ setState }) => {
        setState(increment(1), () => {
          setState(increment(10), () => {
            setState(increment(100));
          });
        });
      }
    };
    const wrapper = wrap(initialState, { effects, ...props });
    getState(wrapper).tick();
    expect(getState(wrapper).count).toBe(111);
  });

  test("onMount", () => {
    const initialState = { count: 0 };
    const onMount = jest.fn(({ state, setState }) => {
      if (state.count === 0) {
        setState(increment(10));
      }
    });
    const wrapper = wrap(initialState, { onMount, ...props });
    expect(onMount).toHaveBeenCalledTimes(1);
    expect(getState(wrapper)).toEqual({ count: 10 });
  });

  test("onMount with setState callback", () => {
    const initialState = { count: 0 };
    const onMount = ({ setState }) => {
      setState(increment(1), () => {
        setState(increment(10), () => {
          setState(increment(100));
        });
      });
    };
    const wrapper = wrap(initialState, { onMount, ...props });
    expect(getState(wrapper)).toEqual({ count: 111 });
  });

  test("onMount delayed", () => {
    jest.useFakeTimers();
    const initialState = { count: 0 };
    const onMount = ({ setState }) => {
      setTimeout(() => setState(increment(10)), 1000);
    };
    const wrapper = wrap(initialState, { onMount, ...props });
    expect(getState(wrapper)).toEqual({ count: 0 });
    jest.advanceTimersByTime(1000);
    expect(getState(wrapper)).toEqual({ count: 10 });
  });

  test("onUpdate", () => {
    const initialState = { count: 0 };
    const actions = { increment };
    const onUpdate = jest.fn(({ prevState, setState }) => {
      if (prevState.count === 0) {
        setState(increment(10));
      }
    });
    const wrapper = wrap(initialState, { onUpdate, actions, ...props });
    getState(wrapper).increment(10);
    expect(onUpdate).toHaveBeenCalledTimes(2);
    expect(getState(wrapper).count).toBe(20);
  });

  test("onUpdate with setState callback", () => {
    const initialState = { count: 0 };
    const actions = { increment };
    const onUpdate = ({ prevState, setState }) => {
      if (prevState.count === 0) {
        setState(increment(1), () => {
          setState(increment(10), () => {
            setState(increment(100));
          });
        });
      }
    };
    const wrapper = wrap(initialState, { onUpdate, actions, ...props });
    getState(wrapper).increment(1);
    expect(getState(wrapper).count).toBe(112);
  });

  test("onUpdate delayed", () => {
    jest.useFakeTimers();
    const initialState = { count: 0 };
    const actions = { increment };
    const onUpdate = ({ setState }) => {
      setTimeout(() => setState(increment(10)), 1000);
    };
    const wrapper = wrap(initialState, { onUpdate, actions, ...props });
    getState(wrapper).increment(10);
    expect(getState(wrapper).count).toBe(10);
    jest.advanceTimersByTime(1000);
    expect(getState(wrapper).count).toBe(20);
  });

  test("onUpdate should be triggered on onMount", () => {
    const initialState = { count: 0 };
    const onMount = ({ setState }) => {
      setState(increment(10));
    };
    const onUpdate = jest.fn();
    wrap(initialState, { onUpdate, onMount, ...props });
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  test("onUpdate should be triggered on onUpdate", () => {
    const initialState = { count: 0 };
    const actions = { increment };
    const onUpdate = jest.fn(({ state, setState }) => {
      if (state.count <= 20) {
        setState(increment(10));
      }
    });
    const wrapper = wrap(initialState, { onUpdate, actions, ...props });
    expect(onUpdate).toHaveBeenCalledTimes(0);
    getState(wrapper).increment(10);
    expect(onUpdate).toHaveBeenCalledTimes(3);
    expect(getState(wrapper).count).toBe(30);
  });

  test("onUnmount", () => {
    const initialState = { count: 0 };
    const onUnmount = jest.fn(({ state, setState }) => {
      expect(state).toEqual(initialState);
      expect(setState).toEqual(expect.any(Function));
    });
    const Component = ({ hide }) => (
      <Provider>
        {!hide && (
          <Container initialState={initialState} onUnmount={onUnmount}>
            {state => <div state={state} />}
          </Container>
        )}
      </Provider>
    );
    const wrapper = mount(<Component />);
    expect(onUnmount).not.toHaveBeenCalled();
    wrapper.setProps({ hide: true });
    expect(onUnmount).toHaveBeenCalledTimes(1);
  });
};

describe("local", () => {
  test("onUnmount setState is noop", () => {
    const initialState = { count: 0 };
    const onUnmount = jest.fn(({ setState }) => {
      setState(increment(10));
    });
    const Component = ({ hide }) => (
      <Provider>
        {!hide && (
          <Container initialState={initialState} onUnmount={onUnmount}>
            {state => <div state={state} />}
          </Container>
        )}
      </Provider>
    );
    const wrapper = mount(<Component />);
    wrapper.setProps({ hide: true });
    expect(onUnmount).toHaveBeenCalledTimes(1);
  });

  createTests()();
});

describe("context", () => {
  test("initialState", () => {
    const initialState = { foo: { count: 0 } };
    const wrapper = wrap(undefined, { context: "foo" }, { initialState });
    expect(getState(wrapper)).toEqual({
      count: 0
    });
  });

  test("multiple initialState", () => {
    const initialState = { foo: { count: 0, foo: "bar" }, bar: {} };
    const wrapper = wrap(undefined, { context: "foo" }, { initialState });
    expect(getState(wrapper)).toEqual({
      count: 0,
      foo: "bar"
    });
  });

  test("multiple contexts", () => {
    const initialState = { foo: { count: 0 }, bar: { count: 1 } };
    const actions = { increment };
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

  test("context initialState overrides local initialState", () => {
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

  test("only the first onMount should be called", () => {
    const onMount = jest.fn();
    const MyContainer = props => (
      <Container context="foo" onMount={onMount} {...props} />
    );
    mount(
      <Provider>
        <MyContainer>{state => <div state={state} />}</MyContainer>
        <MyContainer>{state => <span state={state} />}</MyContainer>
      </Provider>
    );
    expect(onMount).toHaveBeenCalledTimes(1);
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
          {state => <div state={state} />}
        </MyContainer>
        <MyContainer onUpdate={onUpdate2}>
          {state => <span state={state} />}
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
    const onUnmount = ({ setState }) => {
      setState(increment(10));
    };
    const Component = ({ hide }) => (
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

  test("onUnmount should be called only for the last unmounted container", () => {
    const onUnmount = jest.fn();
    const MyContainer = props => (
      <Container context="foo" onUnmount={onUnmount} {...props} />
    );
    const Component = ({ hide1, hide2 }) => (
      <Provider>
        {!hide1 && <MyContainer>{() => <div />}</MyContainer>}
        {!hide2 && <MyContainer>{() => <span />}</MyContainer>}
      </Provider>
    );
    const wrapper = mount(<Component />);
    wrapper.setProps({ hide1: true });
    expect(onUnmount).toHaveBeenCalledTimes(0);
    wrapper.setProps({ hide2: true });
    expect(onUnmount).toHaveBeenCalledTimes(1);
  });

  test("onUnmount setState", () => {
    const initialState = { count: 0 };
    const onUnmount = ({ setState }) => {
      setState(increment(10));
    };
    const Component = ({ hide }) => (
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
        <Consumer>{ctx => <span state={ctx.state.foo} />}</Consumer>
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
    const Component = ({ hide }) => (
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
        <Consumer>{ctx => <span state={ctx.state.foo} />}</Consumer>
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
    const Component = ({ hide }) => (
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
        <Consumer>{ctx => <span state={ctx.state.foo} />}</Consumer>
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
