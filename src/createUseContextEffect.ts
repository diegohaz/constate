import * as React from "react";

function createUseContextEffect<State>(
  type: "useEffect" | "useMutationEffect" | "useLayoutEffect" = "useEffect"
) {
  const consumers: {
    [K in keyof State]?: React.MutableRefObject<K> | null
  } = {};

  return function useContextEffect(
    contextKey: React.MutableRefObject<keyof State> | null | undefined,
    create: () => void | (() => void),
    inputs?: ReadonlyArray<any>
  ) {
    const key = contextKey ? contextKey.current : contextKey;

    if (key && consumers[key] == null) {
      consumers[key] = contextKey!;
    }

    React.useMutationEffect(
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
