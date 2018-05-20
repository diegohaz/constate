import {
  mapSetStateToActions,
  mapArgumentToFunctions,
  parseUpdater
} from "../src/utils";

test("mapSetStateToActions", () => {
  const setState = jest.fn(fn => fn(2));
  const actionsMap = {
    foo: n => state => ({ n: state + n })
  };
  const result = mapSetStateToActions(setState, actionsMap);
  expect(result.foo(2)).toEqual({ n: 4 });
});

test("mapArgumentToFunctions", () => {
  const state = { foo: 1 };
  const selectorsMap = {
    foo: n => s => s.foo + n
  };
  const result = mapArgumentToFunctions(state, selectorsMap);
  expect(result.foo(1)).toBe(2);
});

test("parseUpdater", () => {
  expect(parseUpdater({ foo: "bar" })).toEqual({ foo: "bar" });
  expect(
    parseUpdater(state => ({ count: state.count + 1 }), { count: 10 })
  ).toEqual({ count: 11 });
});
