import {
  mapStateToActions,
  mapStateToSelectors,
  mapStateToEffects
} from "../src/utils";

test("mapStateToActions", () => {
  const setState = jest.fn(fn => fn(2));
  const actionsMap = {
    foo: n => state => ({ n: state + n })
  };
  const result = mapStateToActions(setState, actionsMap);
  expect(result.foo(2)).toEqual({ n: 4 });
});

test("mapStateToSelectors", () => {
  const state = { foo: 1 };
  const selectorsMap = {
    foo: n => s => s.foo + n
  };
  const result = mapStateToSelectors(state, selectorsMap);
  expect(result.foo(1)).toBe(2);
});

test("mapStateToEffects", () => {
  const arg = { foo: "foo", bar: "bar" };
  const effectsMap = {
    foo: baz => ({ foo, bar }) => foo + bar + baz
  };
  const result = mapStateToEffects(arg, effectsMap);
  expect(result.foo("baz")).toBe("foobarbaz");
});
