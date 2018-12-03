import * as React from "react";
import { ContextKeyObject } from "./types";

function createUseContextEffect<State>(
  type: "useEffect" | "useLayoutEffect" = "useEffect"
) {
  const consumers: {
    [K in keyof State]?: React.MutableRefObject<K> | null
  } = {};

  return function useContextEffect(
    contextKey: ContextKeyObject<keyof State>,
    create: () => void | (() => void),
    inputs?: ReadonlyArray<any>
  ) {
    const key = contextKey ? contextKey.current : contextKey;

    if (key && consumers[key] == null) {
      consumers[key] = contextKey!;
    }

    React.useLayoutEffect(
      () => () => {
        if (key && consumers[key] === contextKey) {
          consumers[key] = null;
        }
      },
      [key]
    );

    React[type](
      () => {
        if (!key || consumers[key] === contextKey) {
          return create();
        }
        return undefined;
      },
      inputs ? [key, ...inputs] : undefined
    );
  };
}

export default createUseContextEffect;
