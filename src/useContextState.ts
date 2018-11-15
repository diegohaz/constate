import { createContext, useContext, useMutationEffect, useState } from "react";
import Context, { ContextState } from "./Context";

const EmptyContext = createContext<ContextState>({ state: {} });

function useContextState(context?: string, initialState?: any) {
  const [localState, setLocalState] = useState(initialState);
  const { state: contextState, setContextState } = useContext(
    context ? Context : EmptyContext
  );

  const state =
    context && setContextState
      ? typeof contextState[context] !== "undefined"
        ? contextState[context]
        : initialState
      : localState;
  const setState =
    context && setContextState
      ? (newValue: any) => setContextState(context, newValue)
      : setLocalState;

  useMutationEffect(
    () => {
      if (context && typeof contextState[context] === "undefined") {
        setState(initialState);
      }
    },
    [context, initialState]
  );

  return [state, setState];
}

export default useContextState;
