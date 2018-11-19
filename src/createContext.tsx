import * as React from "react";
import { ContextState } from "./types";
import { hash } from "./utils";
import createUseContextEffect from "./createUseContextEffect";
import createUseContextReducer from "./createUseContextReducer";
import createUseContextRef from "./createUseContextRef";
import createUseContextState from "./createUseContextState";

function createContext<State>(initialState: State) {
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

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const state = React.useState(initialState);
    const value = React.useMemo(() => state, [state[0]]);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return {
    Context,
    Provider,
    useContextRef: createUseContextRef(Context),
    useContextState: createUseContextState(Context),
    useContextReducer: createUseContextReducer(Context),
    useContextEffect: createUseContextEffect(Context),
    useContextLayoutEffect: createUseContextEffect(Context, "useLayoutEffect"),
    useContextMutationEffect: createUseContextEffect(
      Context,
      "useMutationEffect"
    )
  };
}

export default createContext;
