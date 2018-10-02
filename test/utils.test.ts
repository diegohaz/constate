import {
  mapSetStateToActions,
  mapStateToSelectors,
  mapPropsToEffects,
  parseUpdater
} from "../src/utils";
import { ActionMap, SelectorMap, EffectMap } from "../src";

test("mapSetStateToActions", () => {
  type State = { count: number };
  type Actions = { increment: (amount: number) => void };

  const initialState: State = {
    count: 1
  };

  const setState = jest.fn(fn => {
    fn(initialState);
  });

  const actions: ActionMap<State, Actions> = {
    increment: amount => state => ({ count: state.count + amount })
  };

  const result = mapSetStateToActions(setState, actions);

  result.increment(2);

  expect(setState).toHaveBeenCalledWith(
    expect.any(Function),
    undefined,
    "increment"
  );
});

test("mapStateToSelectors", () => {
  type State = { count: number };
  type Selectors = { getParity: () => "even" | "odd" };

  const initialState: State = { count: 1 };

  const selectors: SelectorMap<State, Selectors> = {
    getParity: () => state => (state.count % 2 === 0 ? "even" : "odd")
  };

  const result = mapStateToSelectors(initialState, selectors);
  expect(result.getParity()).toBe("odd");
});

test("mapPropsToEffects", () => {
  type State = { count: number };
  type Effects = { increment: (amount: number) => void };

  const state: State = {
    count: 1
  };

  const setState = jest.fn(fn => {
    fn(state);
  });

  const effects: EffectMap<State, Effects> = {
    increment: () => props => {
      expect(props.state).toBe(state);
      expect(props.setState).toBe(setState);
    }
  };
  const result = mapPropsToEffects(() => ({ state, setState }), effects);
  result.increment(1);
});

test("parseUpdater", () => {
  expect(parseUpdater({ foo: "bar" }, {})).toEqual({ foo: "bar" });
  expect(
    parseUpdater(state => ({ count: state.count + 1 }), { count: 10 })
  ).toEqual({ count: 11 });
});
