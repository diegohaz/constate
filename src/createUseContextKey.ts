import * as React from "react";
import { ContextKeyString } from "./utils/types";

export interface UseContextKey<State> {
  (contextKey?: null): undefined;
  <K extends keyof State>(contextKey: K): React.RefObject<K>;
}

function createUseContextKey<State>() {
  return function useContextKey(contextKey?: ContextKeyString<keyof State>) {
    const key = React.useRef(contextKey);
    return contextKey ? key : undefined;
  } as UseContextKey<State>;
}

export default createUseContextKey;
