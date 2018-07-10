import { increment, getParity } from "./testUtils";

const createCommonTests = (props, getState, wrap) => () => {
  test("initialState", () => {
    const initialState = { foo: "bar" };
    const wrapper = wrap({ ...props, initialState });
    expect(getState(wrapper)).toEqual(initialState);
  });

  test("multiple initialState", () => {
    const initialState = { foo: "bar", baz: "qux" };
    const wrapper = wrap({ ...props, initialState });
    expect(getState(wrapper)).toEqual(initialState);
  });

  test("actions", () => {
    const initialState = { count: 0 };
    const actions = { increment };
    const wrapper = wrap({ ...props, initialState, actions });
    expect(getState(wrapper)).toEqual({
      count: 0,
      increment: expect.any(Function)
    });
    getState(wrapper).increment(2);
    expect(getState(wrapper).count).toBe(2);
    getState(wrapper).increment(2);
    expect(getState(wrapper).count).toBe(4);
  });

  test("actions with mutiple initialState", () => {
    const initialState = { count: 0, foo: "bar" };
    const actions = { increment };
    const wrapper = wrap({ ...props, initialState, actions });
    expect(getState(wrapper)).toEqual({
      count: 0,
      foo: "bar",
      increment: expect.any(Function)
    });
    getState(wrapper).increment(2);
    expect(getState(wrapper).count).toBe(2);
    expect(getState(wrapper).foo).toBe("bar");
  });

  test("actions without function", () => {
    const initialState = { count: 10 };
    const actions = { reset: () => ({ count: 0 }) };
    const wrapper = wrap({ ...props, initialState, actions });
    getState(wrapper).reset();
    expect(getState(wrapper).count).toBe(0);
  });

  test("selectors", () => {
    const initialState = { count: 0 };
    const selectors = { getParity };
    const wrapper = wrap({ ...props, initialState, selectors });
    expect(getState(wrapper).count).toBe(0);
    expect(getState(wrapper).getParity()).toBe("even");
  });

  test("selectors with mutiple initialState", () => {
    const initialState = { count: 0, foo: "bar" };
    const selectors = { getParity };
    const wrapper = wrap({ ...props, initialState, selectors });
    expect(getState(wrapper).count).toBe(0);
    expect(getState(wrapper).foo).toBe("bar");
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
    const wrapper = wrap({ ...props, initialState, effects });
    expect(getState(wrapper)).toEqual({ count: 0, tick: expect.any(Function) });
    getState(wrapper).tick();
    expect(getState(wrapper).count).toBe(1);
    jest.advanceTimersByTime(1000);
    expect(getState(wrapper).count).toBe(2);
    jest.advanceTimersByTime(1000);
    expect(getState(wrapper).count).toBe(3);
  });

  test("effects with setState without function", () => {
    const initialState = { count: 10 };
    const effects = {
      reset: () => ({ setState }) => setState({ count: 0 })
    };
    const wrapper = wrap({ ...props, initialState, effects });
    getState(wrapper).reset();
    expect(getState(wrapper).count).toBe(0);
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
    const wrapper = wrap({ ...props, initialState, effects });
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
    const wrapper = wrap({ ...props, initialState, onMount });
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
    const wrapper = wrap({ ...props, initialState, onMount });
    expect(getState(wrapper)).toEqual({ count: 111 });
  });

  test("onMount delayed", () => {
    jest.useFakeTimers();
    const initialState = { count: 0 };
    const onMount = ({ setState }) => {
      setTimeout(() => setState(increment(10)), 1000);
    };
    const wrapper = wrap({ ...props, initialState, onMount });
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
    const wrapper = wrap({ ...props, initialState, onUpdate, actions });
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
    const wrapper = wrap({ ...props, initialState, onUpdate, actions });
    getState(wrapper).increment(1);
    expect(getState(wrapper).count).toBe(112);
  });

  test("onUpdate delayed", () => {
    jest.useFakeTimers();
    const initialState = { count: 0 };
    const actions = { increment };
    const onUpdate = ({ state, setState }) => {
      if (state.count === 10) {
        setTimeout(() => setState(increment(10)), 1000);
      }
    };
    const wrapper = wrap({ ...props, initialState, onUpdate, actions });
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
    wrap({ ...props, initialState, onUpdate, onMount });
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
    const wrapper = wrap({ ...props, initialState, onUpdate, actions });
    expect(onUpdate).toHaveBeenCalledTimes(0);
    getState(wrapper).increment(10);
    expect(onUpdate).toHaveBeenCalledTimes(3);
    expect(getState(wrapper).count).toBe(30);
  });

  test("onUpdate action type", () => {
    const initialState = { count: 0 };
    const actions = { increment };
    const onUpdate = jest.fn();
    const wrapper = wrap({ ...props, initialState, onUpdate, actions });
    getState(wrapper).increment(10);
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "increment"
      })
    );
  });

  test("onUpdate effect type", () => {
    const initialState = { count: 0 };
    const effects = {
      increment: amount => ({ setState }) =>
        setState(state => ({ count: state.count + amount }))
    };
    const onUpdate = jest.fn();
    const wrapper = wrap({ ...props, initialState, onUpdate, effects });
    getState(wrapper).increment(10);
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "increment"
      })
    );
  });

  test("onUpdate onMount type", () => {
    const initialState = { count: 0 };
    const onMount = ({ setState }) => setState(increment(10));
    const onUpdate = jest.fn();
    wrap({ ...props, initialState, onUpdate, onMount });
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ type: "onMount" })
    );
  });

  test("onUpdate onUpdate type", () => {
    const initialState = { count: 0 };
    const actions = { increment };
    const onUpdate = jest.fn(({ state, setState }) => {
      if (state.count <= 20) {
        setState(increment(10));
      }
    });
    const wrapper = wrap({ ...props, initialState, onUpdate, actions });
    getState(wrapper).increment(10);
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "onUpdate"
      })
    );
  });

  test("shouldUpdate", () => {
    const initialState = { count: 0 };
    const actions = { increment };
    const shouldUpdate = jest.fn(({ state, nextState }) => {
      if (state.count === 0 && nextState.count === 1) {
        return false;
      }
      return true;
    });
    const onUpdate = jest.fn();
    const wrapper = wrap({
      ...props,
      initialState,
      actions,
      shouldUpdate,
      onUpdate
    });
    expect(getState(wrapper).count).toBe(0);
    getState(wrapper).increment();
    expect(shouldUpdate).toHaveBeenCalledWith({
      state: expect.objectContaining({ count: 0 }),
      nextState: { count: 1 }
    });
    expect(onUpdate).not.toHaveBeenCalled();
    expect(getState(wrapper).count).toBe(0);
    getState(wrapper).increment();
    expect(getState(wrapper).count).toBe(2);
  });
};

export default createCommonTests;
