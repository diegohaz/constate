import * as React from "react";
import { ContextState } from "./types";
import createUseContextReducer from "./createUseContextReducer";
import { parseUpdater } from "./utils";

export interface UseContextState<State> {
  <K extends keyof State>(contextKey?: K | null): ContextState<State[K]>;

  <K extends keyof State, S extends State[K]>(
    contextKey?: K | null,
    initialState?: S | (() => S) | null
  ): ContextState<S>;
}

function basicStateReducer(state: any, action: any) {
  return parseUpdater(action, state);
}

function createUseContextState<State>(
  context: React.Context<ContextState<State>>
) {
  const useContextReducer = createUseContextReducer(context);

  return ((contextKey?: any, initialState?: any) =>
    useContextReducer(
      contextKey,
      basicStateReducer,
      initialState
    )) as UseContextState<State>;
}

export default createUseContextState;
