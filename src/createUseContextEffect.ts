import * as React from "react";

// I'm unemployed anyway
function getCurrentOwner() {
  return (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    .ReactCurrentOwner.current;
}

function createUseContextEffect<State>(
  type: "useEffect" | "useMutationEffect" | "useLayoutEffect" = "useEffect"
) {
  const consumers: { [key: string]: React.MutableRefObject<any> | null } = {};

  return function useContextEffect(
    contextKey: keyof State | undefined | null,
    create: () => void | (() => void),
    inputs?: ReadonlyArray<any>
  ) {
    const key = contextKey as string;
    const consumer = React.useRef(getCurrentOwner());
    if (consumers[key] == null) {
      consumers[key] = consumer.current;
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
        if (!key || consumers[key] === consumer.current) {
          return create();
        }
        return undefined;
      },
      inputs ? [key, ...inputs] : undefined
    );
  };
}

export default createUseContextEffect;
