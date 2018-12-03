import * as React from "react";
import { ContextKeyString, ContextState, ContextReducer } from "./types";

function useInitialState<State>(
  key: ContextKeyString<keyof State>,
  [contextState, setContextState]: ContextState<State>,
  [state]: ContextReducer<State[keyof State], any>
) {
  React.useLayoutEffect(
    () => {
      if (key && contextState[key] == null && state != null) {
        setContextState(prevState => {
          if (prevState[key] == null) {
            return { ...prevState, [key]: state };
          }
          return prevState;
        });
      }
    },
    [key]
  );
}

export default useInitialState;
