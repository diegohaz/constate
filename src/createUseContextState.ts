import * as React from "react";
import { ContextState, HashFunction, ContextKey } from "./types";
import { parseContextKey, useHashContext, useInitialState } from "./utils";

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
    const [contextState, setContextState] = useHashContext(key, context, hash);
    let [state, setState] = React.useState(initialState!);

    if (key) {
      if (contextState[key] != null) {
        state = contextState[key];
      }

      setState = (nextState: any) =>
        setContextState(prevState => ({
          ...prevState,
          [key]:
            typeof nextState === "function"
              ? nextState(prevState[key])
              : nextState
        }));
    }

    useInitialState(key, state, contextState, setContextState);

    return [state, setState];
  } as UseContextState<State>;
}

export default createUseContextState;
