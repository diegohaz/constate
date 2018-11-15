import * as React from "react";
import { stringToBinary, parseUpdater, parseInitialState } from "./utils";
import { ContextState } from "./types";

const EmptyContext = React.createContext<ContextState<any>>([{}, () => {}]);

export interface Pqp<State> {
  <K extends keyof State>(contextKey?: K | null): ContextState<State[K]>;
  <K extends keyof State, S extends State[K]>(
    contextKey?: K | null,
    initialState?: S | (() => S)
  ): ContextState<S>;
}

function createUseContextState<State>(
  Context: React.Context<ContextState<State>>
) {
  const useContextState = ((contextKey?: keyof State, initialState?: any) => {
    const createObservedBits = () =>
      contextKey ? stringToBinary(contextKey as string) : undefined;

    const observedBits = React.useMemo(createObservedBits, [contextKey]);

    const [contextState, setContextState] = React.useContext(
      contextKey ? Context : EmptyContext,
      observedBits
    );

    let [state, setState] = React.useState(initialState!);

    if (contextKey) {
      state =
        typeof contextState[contextKey] !== "undefined"
          ? contextState[contextKey]
          : parseInitialState(initialState);

      setState = (newState: any) =>
        setContextState((oldState: State) =>
          Object.assign({}, oldState, {
            [contextKey]: parseUpdater(newState, oldState[contextKey])
          })
        );
    }

    React.useMutationEffect(
      () => {
        if (
          contextKey &&
          typeof contextState[contextKey] === "undefined" &&
          typeof initialState !== "undefined"
        ) {
          setState(initialState);
        }
      },
      [contextKey]
    );

    return [state, setState];
  }) as Pqp<State>;

  return useContextState;
}

export default createUseContextState;
