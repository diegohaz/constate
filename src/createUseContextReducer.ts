import * as React from "react";
import { hash } from "./utils";
import { ContextReducer, ContextState, Reducer } from "./types";

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

const EmptyContext = React.createContext<any>([]);

function createUseContextReducer<State>(
  context: React.Context<ContextState<State>>
) {
  return ((
    contextKey: keyof State | undefined | null,
    reducer: Reducer<State[keyof State], any>,
    initialState?: State[keyof State],
    initialAction?: any
  ) => {
    const observedBits = contextKey ? hash(contextKey as string) : undefined;

    // @ts-ignore
    const [contextState, setContextState] = React.useContext(
      contextKey ? context : EmptyContext,
      observedBits
    );

    let [state, dispatch] = React.useReducer(
      reducer,
      initialState!,
      contextKey ? undefined : initialAction
    );

    if (contextKey) {
      if (contextState[contextKey] != null) {
        state = contextState[contextKey];
      }

      dispatch = (action: any) =>
        setContextState((prevState: State) =>
          Object.assign({}, prevState, {
            [contextKey]: reducer(prevState[contextKey], action)
          })
        );
    }

    React.useMutationEffect(
      () => {
        if (
          contextKey &&
          contextState[contextKey] == null &&
          (initialState != null || initialAction)
        ) {
          setContextState((prevState: State) => {
            if (prevState[contextKey] == null) {
              return Object.assign({}, prevState, {
                [contextKey]: initialAction
                  ? reducer(state, initialAction)
                  : state
              });
            }
            return prevState;
          });
        }
      },
      [contextKey]
    );

    return [state, dispatch];
  }) as UseContextReducer<State>;
}

export default createUseContextReducer;
