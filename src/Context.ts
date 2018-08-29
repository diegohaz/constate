import * as React from "react";
import { StateUpdater, StateCallback, MountContainer } from "./types";

export interface ContextState {
  state: {
    [key: string]: any;
  };
  setContextState?: <S, K>(
    context: string,
    updaterOrState: StateUpdater<S> | Partial<S>,
    callback?: StateCallback,
    type?: K
  ) => void;
  mountContainer?: MountContainer;
}

const Context = React.createContext<ContextState>({ state: {} });

export default Context;
