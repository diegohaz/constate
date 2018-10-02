import { ReactWrapper } from "enzyme";
import {
  ContainerProps,
  EffectMap,
  ActionMap,
  SelectorMap,
  OnMount,
  OnMountProps,
  OnUpdateProps,
  OnUpdate,
  ShouldUpdateProps
} from "../src";

function createCommonTests(
  props: Partial<ContainerProps<any>>,
  getState: (wrapper: ReactWrapper) => any,
  wrap: (props?: Partial<ContainerProps<any>>) => ReactWrapper
) {
  return () => {
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
      type State = { count: number };
      type Actions = { increment: (amount?: number) => void };

      const initialState: State = { count: 0 };

      const actions: ActionMap<State, Actions> = {
        increment: (amount = 1) => state => ({ count: state.count + amount })
      };

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
      type State = { count: number; foo: string };
      type Actions = { increment: (amount?: number) => void };

      const initialState: State = { count: 0, foo: "bar" };

      const actions: ActionMap<State, Actions> = {
        increment: (amount = 1) => state => ({ count: state.count + amount })
      };

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
      type State = { count: number };

      const initialState: State = { count: 10 };

      const actions = {
        reset: () => ({ count: 0 })
      };

      const wrapper = wrap({ ...props, initialState, actions });

      getState(wrapper).reset();
      expect(getState(wrapper).count).toBe(0);
    });

    test("selectors", () => {
      type State = { count: number };
      type Selectors = { getParity: () => "even" | "odd" };

      const initialState: State = { count: 0 };

      const selectors: SelectorMap<State, Selectors> = {
        getParity: () => state => (state.count % 2 === 0 ? "even" : "odd")
      };

      const wrapper = wrap({ ...props, initialState, selectors });

      expect(getState(wrapper).count).toBe(0);
      expect(getState(wrapper).getParity()).toBe("even");
    });

    test("selectors with mutiple initialState", () => {
      type State = { count: number; foo: string };
      type Selectors = { getParity: () => "even" | "odd" };

      const initialState: State = { count: 0, foo: "bar" };

      const selectors: SelectorMap<State, Selectors> = {
        getParity: () => state => (state.count % 2 === 0 ? "even" : "odd")
      };

      const wrapper = wrap({ ...props, initialState, selectors });

      expect(getState(wrapper).count).toBe(0);
      expect(getState(wrapper).foo).toBe("bar");
      expect(getState(wrapper).getParity()).toBe("even");
    });

    test("effects", () => {
      type State = { count: number };
      type Effects = { tick: () => void };

      const initialState: State = { count: 0 };

      const effects: EffectMap<State, Effects> = {
        tick: () => ({ state, setState }) => {
          setState(s => ({ count: s.count + 1 }));
          setTimeout(() => effects.tick()({ state, setState }), 1000);
        }
      };

      jest.useFakeTimers();

      const wrapper = wrap({ ...props, initialState, effects });

      expect(getState(wrapper)).toEqual({
        count: 0,
        tick: expect.any(Function)
      });
      getState(wrapper).tick();
      expect(getState(wrapper).count).toBe(1);
      jest.advanceTimersByTime(1000);
      expect(getState(wrapper).count).toBe(2);
      jest.advanceTimersByTime(1000);
      expect(getState(wrapper).count).toBe(3);
    });

    test("effects with setState without function", () => {
      type State = { count: number };
      type Effects = { reset: () => void };

      const initialState: State = { count: 10 };
      const effects: EffectMap<State, Effects> = {
        reset: () => ({ setState }) => setState({ count: 0 })
      };
      const wrapper = wrap({ ...props, initialState, effects });
      getState(wrapper).reset();
      expect(getState(wrapper).count).toBe(0);
    });

    test("effects with setState callback", () => {
      type State = { count: number };
      type Effects = { tick: () => void };

      const increment = (amount = 1) => (state: State) => ({
        count: state.count + amount
      });

      const initialState: State = { count: 0 };

      const effects: EffectMap<State, Effects> = {
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
      type State = { count: number };

      const increment = (amount = 1) => (state: State) => ({
        count: state.count + amount
      });

      const initialState: State = { count: 0 };

      const onMount = jest.fn(({ state, setState }: OnMountProps<State>) => {
        if (state.count === 0) {
          setState(increment(10));
        }
      });

      const wrapper = wrap({ ...props, initialState, onMount });

      expect(onMount).toHaveBeenCalledTimes(1);
      expect(getState(wrapper)).toEqual({ count: 10 });
    });

    test("onMount with setState callback", () => {
      type State = { count: number };

      const increment = (amount = 1) => (state: State) => ({
        count: state.count + amount
      });

      const initialState: State = { count: 0 };

      const onMount: OnMount<State> = ({ setState }) => {
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
      type State = { count: number };

      const increment = (amount = 1) => (state: State) => ({
        count: state.count + amount
      });

      const initialState = { count: 0 };

      const onMount: OnMount<State> = ({ setState }) => {
        setTimeout(() => setState(increment(10)), 1000);
      };

      jest.useFakeTimers();

      const wrapper = wrap({ ...props, initialState, onMount });

      expect(getState(wrapper)).toEqual({ count: 0 });
      jest.advanceTimersByTime(1000);
      expect(getState(wrapper)).toEqual({ count: 10 });
    });

    test("onUpdate", () => {
      type State = { count: number };
      type Actions = { increment: (amount?: number) => void };

      const initialState: State = { count: 0 };

      const actions: ActionMap<State, Actions> = {
        increment: (amount = 1) => state => ({ count: state.count + amount })
      };

      const onUpdate = jest.fn(
        ({ prevState, setState }: OnUpdateProps<State, Actions>) => {
          if (prevState.count === 0) {
            setState(actions.increment(10));
          }
        }
      );

      const wrapper = wrap({ ...props, initialState, onUpdate, actions });

      getState(wrapper).increment(10);
      expect(onUpdate).toHaveBeenCalledTimes(2);
      expect(getState(wrapper).count).toBe(20);
    });

    test("onUpdate with setState callback", () => {
      type State = { count: number };
      type Actions = { increment: (amount?: number) => void };

      const initialState: State = { count: 0 };

      const actions: ActionMap<State, Actions> = {
        increment: (amount = 1) => state => ({ count: state.count + amount })
      };

      const onUpdate: OnUpdate<State, Actions> = ({ prevState, setState }) => {
        if (prevState.count === 0) {
          setState(actions.increment(1), () => {
            setState(actions.increment(10), () => {
              setState(actions.increment(100));
            });
          });
        }
      };

      const wrapper = wrap({ ...props, initialState, onUpdate, actions });

      getState(wrapper).increment(1);
      expect(getState(wrapper).count).toBe(112);
    });

    test("onUpdate delayed", () => {
      type State = { count: number };
      type Actions = { increment: (amount?: number) => void };

      const initialState: State = { count: 0 };

      const actions: ActionMap<State, Actions> = {
        increment: (amount = 1) => state => ({ count: state.count + amount })
      };

      const onUpdate: OnUpdate<State, Actions> = ({ state, setState }) => {
        if (state.count === 10) {
          setTimeout(() => setState(actions.increment(10)), 1000);
        }
      };

      jest.useFakeTimers();

      const wrapper = wrap({ ...props, initialState, onUpdate, actions });

      getState(wrapper).increment(10);
      expect(getState(wrapper).count).toBe(10);
      jest.advanceTimersByTime(1000);
      expect(getState(wrapper).count).toBe(20);
    });

    test("onUpdate should be triggered on onMount", () => {
      type State = { count: number };

      const increment = (amount = 1) => (state: State) => ({
        count: state.count + amount
      });

      const initialState: State = { count: 0 };

      const onMount: OnMount<State> = ({ setState }) => {
        setState(increment(10));
      };

      const onUpdate = jest.fn();

      wrap({ ...props, initialState, onUpdate, onMount });

      expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    test("onUpdate should be triggered on onUpdate", () => {
      type State = { count: number };
      type Actions = { increment: (amount?: number) => void };

      const initialState: State = { count: 0 };

      const actions: ActionMap<State, Actions> = {
        increment: (amount = 1) => state => ({ count: state.count + amount })
      };

      const onUpdate = jest.fn(
        ({ state, setState }: OnUpdateProps<State, Actions>) => {
          if (state.count <= 20) {
            setState(actions.increment(10));
          }
        }
      );

      const wrapper = wrap({ ...props, initialState, onUpdate, actions });

      expect(onUpdate).toHaveBeenCalledTimes(0);
      getState(wrapper).increment(10);
      expect(onUpdate).toHaveBeenCalledTimes(3);
      expect(getState(wrapper).count).toBe(30);
    });

    test("onUpdate action type", () => {
      type State = { count: number };
      type Actions = { increment: (amount?: number) => void };

      const initialState: State = { count: 0 };

      const actions: ActionMap<State, Actions> = {
        increment: (amount = 1) => state => ({ count: state.count + amount })
      };

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
      type State = { count: number };
      type Effects = { increment: (amount?: number) => void };

      const initialState: State = { count: 0 };

      const effects: EffectMap<State, Effects> = {
        increment: (amount = 1) => ({ setState }) =>
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
      type State = { count: number };

      const increment = (amount = 1) => (state: State) => ({
        count: state.count + amount
      });

      const initialState: State = { count: 0 };

      const onMount: OnMount<State> = ({ setState }) => setState(increment(10));

      const onUpdate = jest.fn();

      wrap({ ...props, initialState, onUpdate, onMount });

      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ type: "onMount" })
      );
    });

    test("onUpdate onUpdate type", () => {
      type State = { count: number };
      type Actions = { increment: (amount?: number) => void };

      const initialState: State = { count: 0 };

      const actions: ActionMap<State, Actions> = {
        increment: (amount = 1) => state => ({ count: state.count + amount })
      };

      const onUpdate = jest.fn(
        ({ state, setState }: OnUpdateProps<State, Actions>) => {
          if (state.count <= 20) {
            setState(actions.increment(10));
          }
        }
      );

      const wrapper = wrap({ ...props, initialState, onUpdate, actions });

      getState(wrapper).increment(10);
      expect(onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "onUpdate"
        })
      );
    });

    test("shouldUpdate", () => {
      type State = { count: number };
      type Actions = { increment: (amount?: number) => void };

      const initialState: State = { count: 0 };

      const actions: ActionMap<State, Actions> = {
        increment: (amount = 1) => state => ({ count: state.count + amount })
      };

      const shouldUpdate = jest.fn(
        ({ state, nextState }: ShouldUpdateProps<State>) => {
          if (state.count === 0 && nextState.count === 1) {
            return false;
          }
          return true;
        }
      );

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
      expect(onUpdate).toHaveBeenCalled();
      expect(getState(wrapper).count).toBe(2);
    });
  };
}

export default createCommonTests;
