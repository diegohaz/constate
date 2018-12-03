import * as React from "react";

export type StateUpdater<State> = (state: State) => State;

export type SetState<State> = (state: State | StateUpdater<State>) => void;

export type Reducer<State, Action> = (state: State, action: Action) => State;

export type ContextState<State> = [State, SetState<State>];

export type ContextReducer<State, Action> = [State, (action: Action) => void];

export type ContextKeyString<State> = keyof State | undefined | null;

export type ContextKey<State> =
  | React.RefObject<keyof State>
  | ContextKeyString<State>;

export type HashFunction = (key: string) => number;
