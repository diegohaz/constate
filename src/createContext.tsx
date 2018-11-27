import * as React from "react";
import { ContextState } from "./types";
import createUseContextEffect from "./createUseContextEffect";
import createUseContextReducer from "./createUseContextReducer";
import createUseContextState from "./createUseContextState";
import useDevtools from "./useDevtools";
import createUseContextKey from "./createUseContextKey";

export type ProviderProps = {
  children: React.ReactNode;
  devtools?: boolean;
};

function createHash(skipLength: number) {
  const hashMap: { [key: string]: number } = {};

  return function hash(key: string) {
    if (hashMap[key] !== undefined) {
      return hashMap[key];
    }
    const { length } = Object.keys(hashMap);
    // 2, 4, 8, 16...
    hashMap[key] = 1 << ((length % (30 - skipLength)) + skipLength);
    return hashMap[key];
  };
}

function createCalculateChangedBits(hash: (key: string) => number) {
  return function calculateChangedBits<State>(prev: State, next: State) {
    let changedBits = 1;
    if (typeof next !== "object" || Array.isArray(next) || next === null) {
      return changedBits;
    }
    for (const contextKey in next) {
      if (prev[contextKey] !== next[contextKey]) {
        changedBits |= hash(contextKey);
      }
    }
    return changedBits;
  };
}

function createProvider<State>(
  Context: React.Context<ContextState<State>>,
  initialState: State
) {
  return function Provider({ children, devtools }: ProviderProps) {
    const state = React.useState(initialState);
    const value = React.useMemo(() => state, [state[0]]);

    useDevtools(state[0], state[1], { enabled: devtools });

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };
}

function createContext<State>(
  initialState: State,
  calculateChangedBits?: ((prev: State, next: State) => number) | null
) {
  const hash = createHash(1);

  const finalCalculateChangedBits =
    calculateChangedBits === undefined
      ? createCalculateChangedBits(hash)
      : calculateChangedBits;

  const Context = React.createContext<ContextState<State>>(
    [initialState, () => {}],
    finalCalculateChangedBits
      ? ([prev], [next]) => finalCalculateChangedBits(prev, next)
      : undefined
  );

  return {
    Context,
    Provider: createProvider(Context, initialState),
    useContextKey: createUseContextKey<State>(),
    useContextState: createUseContextState(Context, hash),
    useContextReducer: createUseContextReducer(Context, hash),
    useContextEffect: createUseContextEffect<State>(),
    useContextLayoutEffect: createUseContextEffect<State>("useLayoutEffect"),
    useContextMutationEffect: createUseContextEffect<State>("useMutationEffect")
  };
}

export default createContext;
