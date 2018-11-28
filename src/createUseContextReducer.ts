import * as React from "react";
import { ContextReducer, ContextState, Reducer } from "./types";

export interface UseContextReducer<State> {
  <K extends keyof State, Action>(
    contextKey: React.MutableRefObject<K> | K | undefined | null,
    reducer: Reducer<State[K], Action>,
    initialState?: null,
    initialAction?: Action
  ): ContextReducer<State[K], Action>;

  <K extends keyof State, S extends State[K], Action>(
    contextKey: React.MutableRefObject<K> | K | undefined | null,
    reducer: Reducer<S, Action>,
    initialState?: S | (() => S) | null,
    initialAction?: Action
  ): ContextReducer<S, Action>;
}

const EmptyContext = React.createContext<any>([]);

function createUseContextReducer<State>(
  context: React.Context<ContextState<State>>,
  hash: (key: string) => number
) {
  return function useContextReducer(
    contextKey:
      | React.MutableRefObject<keyof State>
      | keyof State
      | undefined
      | null,
    reducer: Reducer<State[keyof State], any>,
    initialState?: State[keyof State],
    initialAction?: any
  ) {
    const key =
      typeof contextKey === "object" && contextKey
        ? contextKey.current
        : contextKey;

    // @ts-ignore
    const [contextState, setContextState] = React.useContext(
      key ? context : EmptyContext,
      key ? hash(key as string) : undefined
    );

    let [state, dispatch] = React.useReducer(
      reducer,
      initialState!,
      initialAction
    );

    if (key) {
      if (contextState[key] != null) {
        state = contextState[key];
      }

      dispatch = (action: any) =>
        setContextState((prevState: State) =>
          Object.assign({}, prevState, {
            [key]: reducer(prevState[key], action)
          })
        );
    }

    React.useLayoutEffect(
      () => {
        if (key && contextState[key] == null && state != null) {
          setContextState((prevState: State) => {
            if (prevState[key] == null) {
              return Object.assign({}, prevState, {
                [key]: state
              });
            }
            return prevState;
          });
        }
      },
      [key]
    );

    return [state, dispatch];
  } as UseContextReducer<State>;
}

export default createUseContextReducer;
