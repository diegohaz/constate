import * as React from "react";

function createUseContextEffect<State>(
  type: "useEffect" | "useMutationEffect" | "useLayoutEffect" = "useEffect"
) {
  const consumers: { [key: string]: React.MutableRefObject<any> | null } = {};

  return (
    contextKey: keyof State | undefined | null,
    create: () => void | (() => void),
    inputs?: ReadonlyArray<any>
  ) => {
    const key = contextKey as string;
    const consumer = React.useRef(null);
    if (consumers[key] == null) {
      consumers[key] = consumer;
    }

    React.useMutationEffect(
      () => {
        if (!key) return undefined;
        return () => {
          consumers[key] = null;
        };
      },
      [key]
    );

    React[type](
      () => {
        if (!key || consumers[key] === consumer) {
          return create();
        }
        return undefined;
      },
      inputs ? [key, ...inputs] : undefined
    );
  };
}

export default createUseContextEffect;
