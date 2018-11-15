import * as React from "react";
import { ContextState, ProviderProps } from "./types";
import { stringToBinary } from "./utils";
import createUseContextState from "./createUseContextState";

function createContext<State>(initialState: State) {
  const Context = React.createContext<ContextState<State>>(
    [initialState, () => {}],
    ([prev], [next]) => {
      let changedBits = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const contextKey in next) {
        if (prev[contextKey] !== next[contextKey]) {
          changedBits |= stringToBinary(contextKey);
        }
      }
      return changedBits;
    }
  );

  const Provider = ({ children }: ProviderProps) => {
    const state = React.useState(initialState);
    const value = React.useMemo(() => state, [state[0]]) as ContextState<State>;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return {
    Context,
    Provider,
    useContextState: createUseContextState(Context)
  };
}

export default createContext;
