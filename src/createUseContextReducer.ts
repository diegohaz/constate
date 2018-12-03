import * as React from "react";
import {
  ContextReducer,
  ContextState,
  HashFunction,
  ContextKey
} from "./types";
import {
  parseContextKey,
  useHashContext,
  useInitialState,
  redefineState
} from "./utils";

export interface UseContextReducer<State> {
  <K extends keyof State, Action>(
    contextKey: ContextKey<K>,
    reducer: React.Reducer<State[K], Action>,
    initialState?: null,
    initialAction?: Action
  ): ContextReducer<State[K], Action>;

  <K extends keyof State, S extends State[K], Action>(
    contextKey: ContextKey<K>,
    reducer: React.Reducer<S, Action>,
    initialState?: S | null,
    initialAction?: Action
  ): ContextReducer<S, Action>;
}

function createUseContextReducer<State>(
  context: React.Context<ContextState<State>>,
  hash: HashFunction
) {
  return function useContextReducer<Action>(
    contextKey: ContextKey<keyof State>,
    reducer: React.Reducer<State[keyof State], Action>,
    initialState?: State[keyof State],
    initialAction?: Action
  ) {
    const key = parseContextKey(contextKey);
    const contextState = useHashContext(key, context, hash);
    const localState = React.useReducer(reducer, initialState!, initialAction);

    useInitialState(key, contextState, localState);

    return redefineState(key, contextState, localState, reducer);
  } as UseContextReducer<State>;
}

export default createUseContextReducer;
