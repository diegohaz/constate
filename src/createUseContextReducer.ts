import * as React from "react";
import {
  ContextReducer,
  ContextState,
  Reducer,
  HashFunction,
  ContextKey
} from "./types";
import { parseContextKey, useHashContext, useInitialState } from "./utils";

export interface UseContextReducer<State> {
  <K extends keyof State, Action>(
    contextKey: ContextKey<K>,
    reducer: Reducer<State[K], Action>,
    initialState?: null,
    initialAction?: Action
  ): ContextReducer<State[K], Action>;

  <K extends keyof State, S extends State[K], Action>(
    contextKey: ContextKey<K>,
    reducer: Reducer<S, Action>,
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
    reducer: Reducer<State[keyof State], Action>,
    initialState?: State[keyof State],
    initialAction?: Action
  ) {
    const key = parseContextKey(contextKey);
    const [contextState, setContextState] = useHashContext(key, context, hash);
    let [state, dispatch] = React.useReducer(
      reducer,
      initialState!,
      initialAction
    );

    if (key) {
      if (contextState[key] != null) {
        state = contextState[key];
      }

      dispatch = action =>
        setContextState((prevState: State) => ({
          ...prevState,
          [key]: reducer(prevState[key], action)
        }));
    }

    useInitialState(key, state, contextState, setContextState);

    return [state, dispatch];
  } as UseContextReducer<State>;
}

export default createUseContextReducer;
