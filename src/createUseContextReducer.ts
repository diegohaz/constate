import * as React from "react";
import { stringToBinary, parseInitialState } from "./utils";
import { ContextReducer, ContextState, Reducer } from "./types";
import { EmptyContext } from "./Context";

export interface UseContextReducer<State> {
  <K extends keyof State, Action>(
    contextKey: K | undefined | null,
    reducer: Reducer<State[K], Action>,
    initialState?: null,
    initialAction?: Action
  ): ContextReducer<State[K], Action>;

  <K extends keyof State, S extends State[K], Action>(
    contextKey: K | undefined | null,
    reducer: Reducer<S, Action>,
    initialState?: S | (() => S) | null,
    initialAction?: Action
  ): ContextReducer<S, Action>;
}

function createUseContextReducer<State>(
  Context: React.Context<ContextState<State>>
) {
  return ((
    contextKey: keyof State | undefined | null,
    reducer: Reducer<State[keyof State], any>,
    initialState?: State[keyof State] | (() => State[keyof State]),
    initialAction?: any
  ) => {
    const createObservedBits = () =>
      contextKey ? stringToBinary(contextKey as string) : undefined;

    const observedBits = React.useMemo(createObservedBits, [contextKey]);

    const [contextState, setContextState] = React.useContext(
      contextKey ? Context : EmptyContext,
      observedBits
    );

    let [state, dispatch] = React.useReducer(
      reducer,
      initialState!,
      contextKey ? undefined : initialAction
    );

    if (contextKey) {
      state =
        contextState[contextKey] != null
          ? contextState[contextKey]
          : parseInitialState(initialState)!;

      dispatch = (action: any) =>
        setContextState((oldState: State) =>
          Object.assign({}, oldState, {
            [contextKey]: reducer(oldState[contextKey], action)
          })
        );
    }

    React.useMutationEffect(
      () => {
        if (contextKey) {
          if (contextState[contextKey] == null && initialState != null) {
            setContextState((oldState: State) =>
              Object.assign({}, oldState, {
                [contextKey]: initialState
              })
            );
          }
          if (initialAction) {
            dispatch(initialAction);
          }
        }
      },
      [contextKey]
    );

    return [state, dispatch];
  }) as UseContextReducer<State>;
}

export default createUseContextReducer;
