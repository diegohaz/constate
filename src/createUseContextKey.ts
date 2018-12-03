import * as React from "react";
import { ContextKeyString } from "./types";

export interface UseContextKey<State> {
  (initialContextKey?: null): undefined;
  <K extends keyof State>(initialContextKey: K): React.MutableRefObject<K>;
}

function createUseContextKey<State>() {
  return function useContextKey(
    initialContextKey?: ContextKeyString<keyof State>
  ) {
    const key = React.useRef(initialContextKey);
    return initialContextKey ? key : undefined;
  } as UseContextKey<State>;
}

export default createUseContextKey;
