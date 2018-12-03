import * as React from "react";
import { render } from "react-testing-library";
import { useContextKey } from "../src";

test("useContextKey", () => {
  let key: React.RefObject<string> | undefined;
  const Component = () => {
    key = useContextKey("foo");
    return null;
  };
  render(<Component />);
  expect(key).toBeTruthy();
  expect(key!.current).toBe("foo");
});

test("undefined useContextKey", () => {
  let key: React.RefObject<string> | undefined;
  const Component = () => {
    key = useContextKey(null);
    return null;
  };
  render(<Component />);
  expect(key).toBeUndefined();
});
