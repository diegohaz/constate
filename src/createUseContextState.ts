import * as React from "react";
import { ContextState, HashFunction, ContextKey } from "./utils/types";
import parseContextKey from "./utils/parseContextKey";
import useHashContext from "./utils/useHashContext";
import useInitialState from "./utils/useInitialState";
import redefineState from "./utils/redefineState";

export interface UseContextState<State> {
  <K extends keyof State>(contextKey?: ContextKey<K>): ContextState<State[K]>;

  <K extends keyof State, S extends State[K]>(
    contextKey?: ContextKey<K>,
    initialState?: S | (() => S) | null
  ): ContextState<S>;
}

function isLazyState<T>(state?: any): state is () => T {
  return typeof state === "function";
}

function createUseContextState<State>(
  context: React.Context<ContextState<State>>,
  hash: HashFunction
) {
  // store lazy initial state returns so we won't call them on every consumer
  const cache: { [K in keyof State]?: any } = {};

  return function useContextState(
    contextKey?: ContextKey<keyof State>,
    initialState?: State[keyof State] | (() => State[keyof State]) | null
  ) {
    const key = parseContextKey(contextKey);
    const hasCache = key && isLazyState(initialState) && cache[key] != null;
    const contextState = useHashContext(key, context, hash);
    const localState = React.useState(hasCache ? cache[key!] : initialState);

    if (key && isLazyState(initialState) && cache[key] == null) {
      // cache localState[0] so the next consumers won't have to compute it
      [cache[key]] = localState;
    }

    useInitialState(key, contextState, localState);

    return redefineState(
      key,
      contextState,
      localState,
      (prevState, nextState) =>
        typeof nextState === "function" ? nextState(prevState) : nextState
    );
  } as UseContextState<State>;
}

export default createUseContextState;
