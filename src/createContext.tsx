import * as React from "react";
import { ContextState } from "./types";
import { hash } from "./utils";
import createUseContextEffect from "./createUseContextEffect";
import createUseContextReducer from "./createUseContextReducer";
import createUseContextState from "./createUseContextState";
import useDevtools from "./useDevtools";

export type ProviderProps = {
  children: React.ReactNode;
  devtools?: boolean;
};

function createContext<State>(initialState: State, name?: string) {
  const Context = React.createContext<ContextState<State>>(
    [initialState, () => {}],
    ([prev], [next]) => {
      let changedBits = 0;
      for (const contextKey in next) {
        if (prev[contextKey] !== next[contextKey]) {
          changedBits |= hash(contextKey);
        }
      }
      return changedBits;
    }
  );

  const Provider = ({ children, devtools }: ProviderProps) => {
    const state = React.useState(initialState);
    const value = React.useMemo(() => state, [state[0]]);

    useDevtools(state[0], state[1], { name, enabled: devtools });

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return {
    Context,
    Provider,
    useContextState: createUseContextState(Context),
    useContextReducer: createUseContextReducer(Context),
    unstable_useContextEffect: createUseContextEffect<State>(),
    unstable_useContextLayoutEffect: createUseContextEffect<State>(
      "useLayoutEffect"
    ),
    unstable_useContextMutationEffect: createUseContextEffect<State>(
      "useMutationEffect"
    )
  };
}

export default createContext;
