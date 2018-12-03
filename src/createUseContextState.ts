import * as React from "react";
import { ContextState, HashFunction, ContextKey } from "./types";
import {
  parseContextKey,
  useHashContext,
  useInitialState,
  redefineState
} from "./utils";

export interface UseContextState<State> {
  <K extends keyof State>(contextKey?: ContextKey<K>): ContextState<State[K]>;

  <K extends keyof State, S extends State[K]>(
    contextKey?: ContextKey<K>,
    initialState?: S | (() => S) | null
  ): ContextState<S>;
}

function createUseContextState<State>(
  context: React.Context<ContextState<State>>,
  hash: HashFunction
) {
  return function useContextState(
    contextKey?: ContextKey<keyof State>,
    initialState?: State[keyof State] | (() => State[keyof State]) | null
  ) {
    const key = parseContextKey(contextKey);
    const contextState = useHashContext(key, context, hash);
    const localState = React.useState(initialState!);

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
