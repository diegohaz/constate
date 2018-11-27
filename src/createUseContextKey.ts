import * as React from "react";

export interface UseContextKey<State> {
  (initialContextKey?: null): undefined;
  <K extends keyof State>(initialContextKey: K): React.MutableRefObject<K>;
}

function createUseContextKey<State>() {
  return function useContextKey(initialContextKey?: keyof State | null) {
    const key = React.useRef(initialContextKey!);
    return initialContextKey ? key : undefined;
  } as UseContextKey<State>;
}

export default createUseContextKey;
