import * as React from "react";
import { ContextState } from "./types";
import createUseContextState from "./createUseContextState";

export interface UseContextRef<State> {
  <T>(
    contextKey?: keyof State | null,
    initialValue?: T
  ): React.MutableRefObject<T>;
}

function createUseContextRef<State>(
  context: React.Context<ContextState<State>>
) {
  const useContextState = createUseContextState(context);

  return ((contextKey?: keyof State | null, initialValue?: any) => {
    let ref = React.useRef(initialValue);
    [ref] = useContextState(
      // @ts-ignore
      contextKey ? `__${contextKey}_ref` : undefined,
      ref
    );

    return ref;
  }) as UseContextRef<State>;
}

export default createUseContextRef;
