import { hash, parseUpdater } from "../src/utils";

test("hash", () => {
  expect(hash("foo")).toBe(1);
  expect(hash("bar")).toBe(2);
  expect(hash("baz")).toBe(4);
});

test("parseUpdater", () => {
  expect(parseUpdater(0, 0)).toBe(0);
  expect(parseUpdater(state => state + 1, 0)).toBe(1);
});
