import * as React from "react";
import { ContextState } from "./types";
import createUseContextReducer from "./createUseContextReducer";

export interface UseContextState<State> {
  <K extends keyof State>(contextKey?: K | null): ContextState<State[K]>;

  <K extends keyof State, S extends State[K]>(
    contextKey?: K | null,
    initialState?: S | (() => S) | null
  ): ContextState<S>;
}

function basicStateReducer(state: any, action: any) {
  return typeof action === "function" ? action(state) : action;
}

function createUseContextState<State>(
  context: React.Context<ContextState<State>>,
  hash: (key: string) => number
) {
  const useContextReducer = createUseContextReducer(context, hash);
  return function useContextState(contextKey?: any, initialState?: any) {
    return useContextReducer(contextKey, basicStateReducer, initialState);
  } as UseContextState<State>;
}

export default createUseContextState;
