import * as React from "react";
import { ContextState } from "./types";
import { getCharCodes } from "./utils";
import createUseContextState from "./createUseContextState";
import createUseContextReducer from "./createUseContextReducer";
import createUseContextEffect from "./createUseContextEffect";

function createContext<State>(initialState: State) {
  const Context = React.createContext<ContextState<State>>(
    [initialState, () => {}],
    ([prev], [next]) => {
      let changedBits = 0;
      for (const contextKey in next) {
        if (prev[contextKey] !== next[contextKey]) {
          changedBits |= getCharCodes(contextKey);
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
